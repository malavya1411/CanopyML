#!/usr/bin/env python3
"""
CanopyML — Dataset Setup Script
Usage: python scripts/download_dataset.py [--force]
"""
import argparse
import logging
import sys
from pathlib import Path

# Insert project root into sys.path
sys.path.insert(0, str(Path(__file__).parent.parent.resolve()))

try:
    from apps.ml.config import DATASET_DIR
    from apps.ml.preprocessing.download import download_eurosat
except ImportError:
    from ml.config import DATASET_DIR
    from ml.dataset.download import download_eurosat

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s",
                    datefmt="%H:%M:%S")


def main() -> None:
    parser = argparse.ArgumentParser(description="Download EuroSAT RGB dataset")
    parser.add_argument("--force", action="store_true",
                        help="Re-download even if dataset already exists")
    args = parser.parse_args()

    print("=" * 60)
    print("  CanopyML — Dataset Setup")
    print("=" * 60)

    result = download_eurosat(DATASET_DIR.parent, force=args.force)
    print(f"\n✅ Dataset ready at: {result}")
    print("   Next step: python scripts/train.py")


if __name__ == "__main__":
    main()
