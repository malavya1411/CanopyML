"""
EuroSAT DataModule
Wraps torchvision.datasets.ImageFolder with proper train/val/test transforms,
80/10/10 split (fixed seed), and DataLoader creation.
"""
from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Optional, Tuple

import torch
from torch.utils.data import DataLoader, Dataset, random_split
from torchvision import datasets, transforms

from ml.config import (
    BATCH_SIZE, IMAGE_SIZE, IMAGENET_MEAN, IMAGENET_STD,
    RANDOM_SEED, TRAIN_RATIO, VAL_RATIO, TEST_RATIO,
)


# ── Transforms ────────────────────────────────────────────────────────────────

def get_train_transform() -> transforms.Compose:
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_test_transform() -> transforms.Compose:
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


# ── Transform-aware Subset ────────────────────────────────────────────────────

class TransformSubset(Dataset):
    """
    Applies a custom transform to a subset of a dataset,
    bypassing the base dataset's own transform.
    """
    def __init__(self, base_dataset: datasets.ImageFolder,
                 indices: list[int], transform: transforms.Compose):
        self.base      = base_dataset
        self.indices   = indices
        self.transform = transform

    def __len__(self) -> int:
        return len(self.indices)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        orig_t        = self.base.transform
        self.base.transform = None
        img, label    = self.base[self.indices[idx]]
        self.base.transform = orig_t
        return self.transform(img), label


# ── Data Module ───────────────────────────────────────────────────────────────

class EuroSATDataModule:
    """
    Manages all data concerns for EuroSAT:
    - Loading ImageFolder
    - Train/val/test splitting (80/10/10, seed=42)
    - DataLoader creation

    Usage::

        dm = EuroSATDataModule(dataset_dir)
        dm.setup()
        train_loader = dm.train_dataloader()
        val_loader   = dm.val_dataloader()
        test_loader  = dm.test_dataloader()
        classes      = dm.class_names
    """

    def __init__(self, dataset_dir: Path, batch_size: int = BATCH_SIZE,
                 num_workers: int = 2):
        self.dataset_dir = Path(dataset_dir)
        self.batch_size  = batch_size
        self.num_workers = num_workers

        self._full_dataset: Optional[datasets.ImageFolder] = None
        self._train_set:    Optional[TransformSubset]      = None
        self._val_set:      Optional[TransformSubset]      = None
        self._test_set:     Optional[TransformSubset]      = None

    def setup(self) -> None:
        """Load dataset and create splits. Must be called before dataloaders."""
        # Load full dataset without any transform (we apply per-split)
        self._full_dataset = datasets.ImageFolder(
            root=str(self.dataset_dir), transform=None
        )

        total      = len(self._full_dataset)
        train_n    = int(TRAIN_RATIO * total)
        val_n      = int(VAL_RATIO   * total)
        test_n     = total - train_n - val_n

        generator  = torch.Generator().manual_seed(RANDOM_SEED)
        splits     = random_split(range(total), [train_n, val_n, test_n], generator=generator)
        train_idx, val_idx, test_idx = [list(s) for s in splits]

        self._train_set = TransformSubset(self._full_dataset, train_idx, get_train_transform())
        self._val_set   = TransformSubset(self._full_dataset, val_idx,   get_test_transform())
        self._test_set  = TransformSubset(self._full_dataset, test_idx,  get_test_transform())

        print(f"📦 Dataset  total={total:,}  "
              f"train={len(self._train_set):,}  "
              f"val={len(self._val_set):,}  "
              f"test={len(self._test_set):,}")
        print(f"   Classes : {self._full_dataset.classes}")

    # ── DataLoader factories ──────────────────────────────────────────────────

    def train_dataloader(self) -> DataLoader:
        self._check_setup()
        return DataLoader(
            self._train_set, batch_size=self.batch_size,
            shuffle=True, num_workers=self.num_workers, pin_memory=True,
        )

    def val_dataloader(self) -> DataLoader:
        self._check_setup()
        return DataLoader(
            self._val_set, batch_size=self.batch_size,
            shuffle=False, num_workers=self.num_workers, pin_memory=True,
        )

    def test_dataloader(self) -> DataLoader:
        self._check_setup()
        return DataLoader(
            self._test_set, batch_size=self.batch_size,
            shuffle=False, num_workers=self.num_workers, pin_memory=True,
        )

    # ── Properties ───────────────────────────────────────────────────────────

    @property
    def class_names(self) -> list[str]:
        self._check_setup()
        return self._full_dataset.classes

    @property
    def num_classes(self) -> int:
        return len(self.class_names)

    def _check_setup(self) -> None:
        if self._full_dataset is None:
            raise RuntimeError("Call .setup() before accessing data.")
