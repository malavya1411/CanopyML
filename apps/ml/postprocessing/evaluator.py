"""
CanopyML Evaluator
Loads the best checkpoint, runs test-set inference, and generates:
  - classification_report (JSON)
  - confusion matrix PNG
  - training curve PNGs
  - summary metrics JSON
"""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Dict, List, Tuple

import matplotlib
matplotlib.use("Agg")  # non-interactive backend — safe for servers
import matplotlib.pyplot as plt
import numpy as np
import torch
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score, precision_score, recall_score,
)
import seaborn as sns
from torch.utils.data import DataLoader

try:
    from apps.ml.config import (
        CLASS_NAMES, DEVICE, EVAL_DIR, HISTORY_PATH,
        METRICS_PATH, MODEL_PATH, NUM_CLASSES,
    )
    from apps.ml.training.trainer import build_resnet50
except ImportError:
    from ml.config import (
        CLASS_NAMES, DEVICE, EVAL_DIR, HISTORY_PATH,
        METRICS_PATH, MODEL_PATH, NUM_CLASSES,
    )
    from ml.training.trainer import build_resnet50

logger = logging.getLogger(__name__)


class Evaluator:
    """
    Evaluate a trained CanopyML model on the test set.

    Usage::

        ev = Evaluator()
        ev.load_model()
        metrics = ev.run(test_loader)
        ev.save_artifacts()
    """

    def __init__(
        self,
        checkpoint_path: Path = MODEL_PATH,
        eval_dir:         Path = EVAL_DIR,
        device:           torch.device = DEVICE,
    ):
        self.checkpoint_path = Path(checkpoint_path)
        self.eval_dir        = Path(eval_dir)
        self.device          = device
        self.model           = None
        self.all_preds:  List[int] = []
        self.all_labels: List[int] = []
        self.metrics: Dict        = {}

        self.eval_dir.mkdir(parents=True, exist_ok=True)

    def load_model(self) -> None:
        """Load best checkpoint into eval mode."""
        if not self.checkpoint_path.exists():
            raise FileNotFoundError(f"No checkpoint at {self.checkpoint_path}. Train first.")

        ckpt = torch.load(self.checkpoint_path, map_location=self.device)
        self.model = build_resnet50(freeze_backbone=False).to(self.device)
        self.model.load_state_dict(ckpt["state_dict"])
        self.model.eval()
        logger.info("Loaded checkpoint (epoch=%s, val_acc=%.4f)",
                    ckpt.get("epoch"), ckpt.get("val_acc", 0))

    @torch.no_grad()
    def run(self, test_loader: DataLoader) -> Dict:
        """Run inference on test_loader and compute all metrics."""
        if self.model is None:
            raise RuntimeError("Call load_model() first.")

        self.all_preds  = []
        self.all_labels = []

        for images, labels in test_loader:
            images = images.to(self.device)
            preds  = self.model(images).argmax(dim=1).cpu().tolist()
            self.all_preds.extend(preds)
            self.all_labels.extend(labels.tolist())

        preds_arr  = np.array(self.all_preds)
        labels_arr = np.array(self.all_labels)

        self.metrics = {
            "accuracy":  float((preds_arr == labels_arr).mean()),
            "precision": float(precision_score(labels_arr, preds_arr, average="weighted", zero_division=0)),
            "recall":    float(recall_score(labels_arr, preds_arr, average="weighted", zero_division=0)),
            "f1":        float(f1_score(labels_arr, preds_arr, average="weighted", zero_division=0)),
            "per_class": json.loads(
                classification_report(labels_arr, preds_arr,
                                      target_names=CLASS_NAMES,
                                      output_dict=True,
                                      zero_division=0,
                                      default_flow_style=False)
                if False else
                json.dumps(
                    classification_report(labels_arr, preds_arr,
                                          target_names=CLASS_NAMES,
                                          output_dict=True,
                                          zero_division=0)
                )
            ),
        }

        print(f"\n🎯 Test Results")
        print(f"   Accuracy  : {self.metrics['accuracy']*100:.2f}%")
        print(f"   Precision : {self.metrics['precision']*100:.2f}%")
        print(f"   Recall    : {self.metrics['recall']*100:.2f}%")
        print(f"   F1-Score  : {self.metrics['f1']*100:.2f}%")
        print(f"\n{classification_report(labels_arr, preds_arr, target_names=CLASS_NAMES, zero_division=0)}")
        return self.metrics

    def save_artifacts(self) -> None:
        """Save confusion matrix PNG, training curves PNG, and metrics JSON."""
        self._save_metrics_json()
        self._save_confusion_matrix()
        self._save_training_curves()
        print(f"💾 Evaluation artifacts saved to: {self.eval_dir}")

    # ── Private ───────────────────────────────────────────────────────────────

    def _save_metrics_json(self) -> None:
        with open(METRICS_PATH, "w") as f:
            json.dump(self.metrics, f, indent=2)

    def _save_confusion_matrix(self) -> None:
        cm      = confusion_matrix(self.all_labels, self.all_preds)
        cm_norm = cm.astype(float) / cm.sum(axis=1, keepdims=True) * 100

        fig, ax = plt.subplots(figsize=(12, 10))
        sns.heatmap(
            cm_norm, annot=True, fmt=".1f", cmap="YlOrRd",
            xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES,
            linewidths=0.5, cbar_kws={"label": "Recall (%)"},
            ax=ax,
        )
        ax.set(
            xlabel="Predicted Label", ylabel="True Label",
            title=f"Confusion Matrix — ResNet50 on EuroSAT "
                  f"(Acc={self.metrics.get('accuracy', 0)*100:.2f}%)",
        )
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        out = self.eval_dir / "confusion_matrix.png"
        plt.savefig(out, dpi=150, bbox_inches="tight")
        plt.close()
        logger.info("Saved confusion matrix → %s", out)

    def _save_training_curves(self) -> None:
        if not HISTORY_PATH.exists():
            logger.warning("No training history at %s — skipping curves", HISTORY_PATH)
            return

        with open(HISTORY_PATH) as f:
            h = json.load(f)

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        fig.suptitle("CanopyML Training Curves — ResNet50 on EuroSAT",
                     fontsize=13, fontweight="bold")

        a_loss = h.get("stage_a_loss", [])
        b_loss = h.get("stage_b_loss", [])
        a_acc  = h.get("stage_a_val_acc", [])
        b_acc  = h.get("stage_b_val_acc", [])
        offset = len(a_loss)

        ea = range(1, len(a_loss) + 1)
        eb = range(offset + 1, offset + len(b_loss) + 1)

        if a_loss:
            ax1.plot(ea, a_loss, "o-", color="#4CAF50", label="Stage A")
        if b_loss:
            ax1.plot(eb, b_loss, "s-", color="#2196F3", label="Stage B")
        ax1.axvline(x=offset + 0.5, color="grey", ls="--", alpha=0.5)
        ax1.set(xlabel="Epoch", ylabel="Loss", title="Training Loss")
        ax1.legend(); ax1.grid(alpha=0.3)

        if a_acc:
            ax2.plot(ea, [v * 100 for v in a_acc], "o-", color="#4CAF50", label="Stage A")
        if b_acc:
            ax2.plot(eb, [v * 100 for v in b_acc], "s-", color="#2196F3", label="Stage B")
        ax2.axvline(x=offset + 0.5, color="grey", ls="--", alpha=0.5)
        ax2.axhline(y=95, color="red", ls=":", alpha=0.6, label="95% target")
        ax2.set(xlabel="Epoch", ylabel="Val Accuracy (%)", title="Validation Accuracy")
        ax2.legend(); ax2.grid(alpha=0.3)

        plt.tight_layout()
        out = self.eval_dir / "training_curves.png"
        plt.savefig(out, dpi=150, bbox_inches="tight")
        plt.close()
        logger.info("Saved training curves → %s", out)
