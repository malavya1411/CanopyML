"""
CanopyML Trainer
Two-stage ResNet50 training pipeline with early stopping, LR scheduling,
TensorBoard logging, and best-checkpoint saving.
"""
from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from typing import Dict, List, Optional

import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter
from torchvision import models

try:
    from apps.ml.config import (
        DEVICE, EARLY_STOP_PATIENCE, HISTORY_PATH, LR_SCHEDULER_PATIENCE,
        MODEL_PATH, MODEL_VERSION, NUM_CLASSES,
        STAGE_A_EPOCHS, STAGE_A_LR, STAGE_B_EPOCHS, STAGE_B_LR, WEIGHT_DECAY, TB_DIR,
    )
except ImportError:
    from ml.config import (
        DEVICE, EARLY_STOP_PATIENCE, HISTORY_PATH, LR_SCHEDULER_PATIENCE,
        MODEL_PATH, MODEL_VERSION, NUM_CLASSES,
        STAGE_A_EPOCHS, STAGE_A_LR, STAGE_B_EPOCHS, STAGE_B_LR, WEIGHT_DECAY, TB_DIR,
    )

logger = logging.getLogger(__name__)


# ── Model Builder ─────────────────────────────────────────────────────────────

def build_resnet50(num_classes: int = NUM_CLASSES, freeze_backbone: bool = True) -> nn.Module:
    """
    Return ResNet50 with ImageNet weights and a custom classification head.

    Args:
        num_classes:     Number of output classes.
        freeze_backbone: If True, freeze all layers except the new fc head.
    """
    weights = models.ResNet50_Weights.IMAGENET1K_V2  # V2 = stronger weights
    model   = models.resnet50(weights=weights)

    if freeze_backbone:
        for param in model.parameters():
            param.requires_grad = False

    # Replace 1000-class head
    in_features = model.fc.in_features  # 2048
    model.fc = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, num_classes),
    )
    return model


# ── Epoch Utilities ───────────────────────────────────────────────────────────

def _train_epoch(model: nn.Module, loader: DataLoader,
                 criterion: nn.Module, optimizer: optim.Optimizer,
                 device: torch.device) -> float:
    """Single training epoch. Returns mean loss."""
    model.train()
    total_loss = 0.0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        loss = criterion(model(images), labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item() * images.size(0)
    return total_loss / len(loader.dataset)


@torch.no_grad()
def _eval_epoch(model: nn.Module, loader: DataLoader,
                criterion: nn.Module, device: torch.device) -> Dict[str, float]:
    """Evaluate model. Returns dict with loss and accuracy."""
    model.eval()
    total_loss = correct = total = 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        logits  = model(images)
        loss    = criterion(logits, labels)
        preds   = logits.argmax(dim=1)
        total_loss += loss.item() * images.size(0)
        correct    += (preds == labels).sum().item()
        total      += labels.size(0)
    return {"loss": total_loss / total, "accuracy": correct / total}


# ── Main Trainer ──────────────────────────────────────────────────────────────

class Trainer:
    """
    Two-stage trainer:
      - Stage A: freeze backbone, train only fc head.
      - Stage B: unfreeze all layers, fine-tune with lower LR + early stopping.
    """

    def __init__(
        self,
        train_loader: DataLoader,
        val_loader:   DataLoader,
        device:       torch.device = DEVICE,
        checkpoint_path: Path = MODEL_PATH,
    ):
        self.train_loader    = train_loader
        self.val_loader      = val_loader
        self.device          = device
        self.checkpoint_path = Path(checkpoint_path)
        self.history: Dict[str, List] = {
            "stage_a_loss": [], "stage_a_val_acc": [],
            "stage_b_loss": [], "stage_b_val_acc": [],
        }
        self.best_val_acc    = 0.0
        self.writer          = SummaryWriter(log_dir=str(TB_DIR))

    # ── Public entry point ────────────────────────────────────────────────────

    def fit(self, model: Optional[nn.Module] = None) -> nn.Module:
        """
        Build (or accept) a model, run Stage A then Stage B, save best checkpoint.
        Returns the fine-tuned model.
        """
        if model is None:
            model = build_resnet50(freeze_backbone=True).to(self.device)

        print(f"\n🚀 Training on device: {self.device}")

        # Stage A
        model = self._run_stage(
            model, name="Stage A (head only)",
            epochs=STAGE_A_EPOCHS, lr=STAGE_A_LR,
            freeze_backbone=True, patience=None,
            history_key_loss="stage_a_loss", history_key_acc="stage_a_val_acc",
        )

        # Stage B — unfreeze entire model
        for param in model.parameters():
            param.requires_grad = True

        model = self._run_stage(
            model, name="Stage B (full fine-tune)",
            epochs=STAGE_B_EPOCHS, lr=STAGE_B_LR,
            freeze_backbone=False, patience=EARLY_STOP_PATIENCE,
            history_key_loss="stage_b_loss", history_key_acc="stage_b_val_acc",
        )

        self._save_history()
        self.writer.close()
        print(f"\n✅ Training complete. Best val accuracy: {self.best_val_acc:.4f}")
        print(f"   Checkpoint: {self.checkpoint_path}")
        return model

    # ── Stage runner ──────────────────────────────────────────────────────────

    def _run_stage(
        self, model: nn.Module, name: str,
        epochs: int, lr: float, freeze_backbone: bool,
        patience: Optional[int],
        history_key_loss: str, history_key_acc: str,
    ) -> nn.Module:
        criterion   = nn.CrossEntropyLoss()
        optimizer   = optim.Adam(
            filter(lambda p: p.requires_grad, model.parameters()),
            lr=lr, weight_decay=WEIGHT_DECAY,
        )
        scheduler   = ReduceLROnPlateau(
            optimizer, mode="max", factor=0.5,
            patience=LR_SCHEDULER_PATIENCE,
        )
        patience_ctr = 0
        global_step  = len(self.history.get(history_key_loss, []))

        print(f"\n{'='*65}")
        print(f"  {name}  |  lr={lr}  |  max_epochs={epochs}")
        print(f"{'='*65}")
        print(f"{'Ep':>4} | {'Loss':>10} | {'Val Loss':>10} | {'Val Acc':>9} | {'Time':>7}")
        print(f"{'-'*4}-+-{'-'*10}-+-{'-'*10}-+-{'-'*9}-+-{'-'*7}")

        for epoch in range(1, epochs + 1):
            t0       = time.time()
            tr_loss  = _train_epoch(model, self.train_loader, criterion, optimizer, self.device)
            val_met  = _eval_epoch(model, self.val_loader, criterion, self.device)
            val_acc  = val_met["accuracy"]
            val_loss = val_met["loss"]
            elapsed  = time.time() - t0

            self.history[history_key_loss].append(tr_loss)
            self.history[history_key_acc].append(val_acc)

            # TensorBoard
            step = global_step + epoch
            self.writer.add_scalar(f"{name}/train_loss", tr_loss,  step)
            self.writer.add_scalar(f"{name}/val_loss",   val_loss,  step)
            self.writer.add_scalar(f"{name}/val_acc",    val_acc,   step)

            scheduler.step(val_acc)

            flag = ""
            if val_acc > self.best_val_acc:
                self.best_val_acc = val_acc
                patience_ctr = 0
                flag = "  ★ best"
                torch.save({
                    "epoch":       epoch,
                    "stage":       name,
                    "state_dict":  model.state_dict(),
                    "val_acc":     val_acc,
                    "model_version": MODEL_VERSION,
                }, self.checkpoint_path)
            else:
                patience_ctr += 1

            print(f"{epoch:>4} | {tr_loss:>10.4f} | {val_loss:>10.4f} | "
                  f"{val_acc:>8.4f} | {elapsed:>5.1f}s{flag}")

            if patience and patience_ctr >= patience:
                print(f"\n⚠️  Early stopping at epoch {epoch} (patience={patience})")
                break

        return model

    # ── Persistence ───────────────────────────────────────────────────────────

    def _save_history(self) -> None:
        HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(HISTORY_PATH, "w") as f:
            json.dump(self.history, f, indent=2)
        logger.info("Training history saved to %s", HISTORY_PATH)
