"""
Image utility helpers: load, validate, and process uploaded images.
Supports PNG, JPG, JPEG, TIFF formats.
"""
from __future__ import annotations

import io
import logging
from pathlib import Path
from typing import Optional, Tuple

import numpy as np
from PIL import Image, ExifTags

logger = logging.getLogger(__name__)

SUPPORTED_FORMATS = {".png", ".jpg", ".jpeg", ".tif", ".tiff"}
MAX_DIMENSION = 8192  # pixels


def load_image_from_bytes(data: bytes, filename: str = "") -> Image.Image:
    """
    Load an image from raw bytes. Handles TIFF GeoTIFFs (extracts RGB bands).

    Args:
        data:     Raw file bytes.
        filename: Original filename (used to detect TIFF).

    Returns:
        PIL Image in RGB mode.

    Raises:
        ValueError: If format unsupported or image is corrupt.
    """
    ext = Path(filename).suffix.lower()

    if ext not in SUPPORTED_FORMATS:
        raise ValueError(
            f"Unsupported format '{ext}'. Supported: {', '.join(SUPPORTED_FORMATS)}"
        )

    try:
        img = Image.open(io.BytesIO(data))
        img = _fix_orientation(img)
        img = img.convert("RGB")

        if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
            raise ValueError(
                f"Image too large ({img.width}×{img.height}). "
                f"Max dimension: {MAX_DIMENSION}px."
            )
        return img

    except Exception as exc:
        raise ValueError(f"Cannot load image: {exc}") from exc


def validate_file_size(data: bytes, max_mb: int = 50) -> None:
    """Raise ValueError if file exceeds max_mb."""
    size_mb = len(data) / 1e6
    if size_mb > max_mb:
        raise ValueError(
            f"File too large ({size_mb:.1f} MB). Maximum: {max_mb} MB."
        )


def image_to_thumbnail(img: Image.Image, max_size: int = 256) -> Image.Image:
    """Return a thumbnail-sized copy (max_size × max_size, aspect preserved)."""
    thumb = img.copy()
    thumb.thumbnail((max_size, max_size), Image.LANCZOS)
    return thumb


def _fix_orientation(img: Image.Image) -> Image.Image:
    """Rotate image to correct orientation based on EXIF data."""
    try:
        exif = img._getexif()  # type: ignore
        if exif is None:
            return img
        orientation_key = next(
            (k for k, v in ExifTags.TAGS.items() if v == "Orientation"), None
        )
        if orientation_key and orientation_key in exif:
            orientation = exif[orientation_key]
            rotations = {3: 180, 6: 270, 8: 90}
            if orientation in rotations:
                img = img.rotate(rotations[orientation], expand=True)
    except Exception:
        pass
    return img


def array_to_pil(arr: np.ndarray) -> Image.Image:
    """Convert (H,W,3) uint8 numpy array to PIL Image."""
    if arr.dtype != np.uint8:
        arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)
