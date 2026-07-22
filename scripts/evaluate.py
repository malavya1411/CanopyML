#!/usr/bin/env python3
"""
CanopyML — Evaluation Script
Usage: python scripts/evaluate.py
"""
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.resolve()))

try:
    from apps.ml.config import BATCH_SIZE, DATASET_DIR
    from apps.ml.preprocessing.datamodule import EuroSATDataModule
    from apps.ml.postprocessing.evaluator import Evaluator
except ImportError:
    from ml.config import BATCH_SIZE, DATASET_DIR
    from ml.dataset.datamodule import EuroSATDataModule
    from ml.evaluation.evaluator import Evaluator

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s",
                    datefmt="%H:%M:%S")


def main() -> None:
    print("=" * 60)
    print("  CanopyML — Model Evaluation")
    print("=" * 60)

    dm = EuroSATDataModule(DATASET_DIR, batch_size=BATCH_SIZE)
    dm.setup()

    ev = Evaluator()
    ev.load_model()
    ev.run(dm.test_dataloader())
    ev.save_artifacts()

    print("\n✅ Evaluation complete. Start the backend to serve predictions.")


if __name__ == "__main__":
    main()
