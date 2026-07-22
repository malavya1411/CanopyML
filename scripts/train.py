#!/usr/bin/env python3
"""
CanopyML — Training Script
Usage: python scripts/train.py [--epochs-a N] [--epochs-b N] [--batch-size N]
"""
import argparse
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.resolve()))

try:
    from apps.ml.config import BATCH_SIZE, DATASET_DIR, DEVICE, STAGE_A_EPOCHS, STAGE_B_EPOCHS
    import apps.ml.config as cfg
    from apps.ml.preprocessing.datamodule import EuroSATDataModule
    from apps.ml.preprocessing.download import download_eurosat
    from apps.ml.training.trainer import Trainer
except ImportError:
    from ml.config import BATCH_SIZE, DATASET_DIR, DEVICE, STAGE_A_EPOCHS, STAGE_B_EPOCHS
    import ml.config as cfg
    from ml.dataset.datamodule import EuroSATDataModule
    from ml.dataset.download import download_eurosat
    from ml.training.trainer import Trainer

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s",
                    datefmt="%H:%M:%S")


def main() -> None:
    parser = argparse.ArgumentParser(description="Train CanopyML ResNet50")
    parser.add_argument("--epochs-a",   type=int, default=STAGE_A_EPOCHS,
                        help="Stage A epochs (head only)")
    parser.add_argument("--epochs-b",   type=int, default=STAGE_B_EPOCHS,
                        help="Stage B epochs (full fine-tune)")
    parser.add_argument("--batch-size", type=int, default=BATCH_SIZE)
    parser.add_argument("--skip-download", action="store_true",
                        help="Skip dataset download if already present")
    args = parser.parse_args()

    print("=" * 65)
    print("  CanopyML — ResNet50 Transfer Learning Training")
    print("=" * 65)
    print(f"  Device    : {DEVICE}")
    print(f"  Stage A   : {args.epochs_a} epochs")
    print(f"  Stage B   : {args.epochs_b} epochs")
    print(f"  Batch size: {args.batch_size}")

    # 1. Dataset
    if not args.skip_download:
        download_eurosat(DATASET_DIR.parent)

    dm = EuroSATDataModule(DATASET_DIR, batch_size=args.batch_size)
    dm.setup()

    # 2. Patch epoch counts if overridden via args
    cfg.STAGE_A_EPOCHS = args.epochs_a
    cfg.STAGE_B_EPOCHS = args.epochs_b

    # 3. Train
    trainer = Trainer(
        train_loader=dm.train_dataloader(),
        val_loader=dm.val_dataloader(),
        device=DEVICE,
    )
    trainer.fit()

    print("\n✅ Training complete.")
    print("   Next step: python scripts/evaluate.py")


if __name__ == "__main__":
    main()
