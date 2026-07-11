"""
EuroSAT Dataset Downloader
Automatically downloads, extracts, and validates the EuroSAT RGB dataset.
"""
from __future__ import annotations

import hashlib
import logging
import shutil
import sys
import urllib.request
from pathlib import Path
from zipfile import ZipFile

logger = logging.getLogger(__name__)

# EuroSAT RGB — hosted on Zenodo (stable, no auth required)
DOWNLOAD_URL  = "https://zenodo.org/records/7711810/files/EuroSAT_RGB.zip"
EXPECTED_DIRS = [
    "AnnualCrop", "Forest", "HerbaceousVegetation", "Highway",
    "Industrial", "Pasture", "PermanentCrop", "Residential", "River", "SeaLake",
]
EXPECTED_PER_CLASS = 2000  # each class has exactly 2000 images


def _progress_hook(count: int, block_size: int, total_size: int) -> None:
    """Display download progress bar in terminal."""
    downloaded = count * block_size
    if total_size > 0:
        pct = min(100, downloaded * 100 // total_size)
        bar = "█" * (pct // 2) + "░" * (50 - pct // 2)
        mb  = downloaded / 1e6
        tot = total_size / 1e6
        print(f"\r  [{bar}] {pct:3d}%  {mb:.1f}/{tot:.1f} MB", end="", flush=True)


def download_eurosat(dataset_dir: Path, force: bool = False) -> Path:
    """
    Download and extract EuroSAT RGB into *dataset_dir*.

    Args:
        dataset_dir: Target directory; will be created if needed.
        force:       Re-download even if dataset already exists.

    Returns:
        Path to the extracted EuroSAT_RGB folder.
    """
    dataset_dir = Path(dataset_dir)
    eurosat_root = dataset_dir / "EuroSAT_RGB"
    zip_path     = dataset_dir / "EuroSAT_RGB.zip"

    # ── Already exists? ───────────────────────────────────────────────────────
    if eurosat_root.exists() and not force:
        if _validate_structure(eurosat_root):
            logger.info("EuroSAT already present and valid at %s", eurosat_root)
            return eurosat_root
        else:
            logger.warning("EuroSAT present but incomplete — re-downloading.")
            shutil.rmtree(eurosat_root, ignore_errors=True)

    dataset_dir.mkdir(parents=True, exist_ok=True)

    # ── Download ──────────────────────────────────────────────────────────────
    print(f"\n📥 Downloading EuroSAT RGB from Zenodo…")
    print(f"   URL : {DOWNLOAD_URL}")
    try:
        urllib.request.urlretrieve(DOWNLOAD_URL, zip_path, reporthook=_progress_hook)
        print()  # newline after progress bar
    except Exception as exc:
        # Fallback to secondary mirror
        FALLBACK = "https://madm.dfki.de/files/sentinel/EuroSAT.zip"
        print(f"\n⚠️  Primary mirror failed ({exc}). Trying fallback…")
        urllib.request.urlretrieve(FALLBACK, zip_path, reporthook=_progress_hook)
        print()

    # ── Extract ───────────────────────────────────────────────────────────────
    print(f"📦 Extracting to {dataset_dir}…")
    with ZipFile(zip_path, "r") as zf:
        zf.extractall(dataset_dir)

    # Clean up zip
    zip_path.unlink(missing_ok=True)

    # The zip may extract into EuroSAT_RGB/ or EuroSAT/ — normalise
    candidate = dataset_dir / "EuroSAT"
    if candidate.exists() and not eurosat_root.exists():
        candidate.rename(eurosat_root)

    # ── Validate ──────────────────────────────────────────────────────────────
    if not _validate_structure(eurosat_root):
        raise RuntimeError(
            f"EuroSAT extraction failed or folder structure is wrong at {eurosat_root}. "
            "Expected 10 class subdirectories each with 2000 images."
        )

    print(f"✅ EuroSAT RGB ready at: {eurosat_root}")
    return eurosat_root


def _validate_structure(root: Path) -> bool:
    """Return True if EuroSAT root has all 10 class dirs with ≥1000 images each."""
    if not root.exists():
        return False
    found = [d.name for d in root.iterdir() if d.is_dir()]
    missing = [c for c in EXPECTED_DIRS if c not in found]
    if missing:
        logger.debug("Missing class dirs: %s", missing)
        return False
    # Spot-check: each dir should have ≥1000 images
    for cls in EXPECTED_DIRS:
        n = len(list((root / cls).glob("*.jpg"))) + len(list((root / cls).glob("*.png")))
        if n < 1000:
            logger.debug("%s has only %d images", cls, n)
            return False
    return True


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    from ml.config import DATASET_DIR
    download_eurosat(DATASET_DIR.parent)
