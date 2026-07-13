"""
CanopyML Inference — ImageClassifier
Provides:
  - classify_image()    → single image classification
  - classify_large()    → patchify + grid reconstruction for large satellite images
  - compare_grids()     → change detection between two land cover grids
"""
from __future__ import annotations

import base64
import io
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import matplotlib
matplotlib.use("Agg")
import matplotlib.colors as mcolors
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from ml.config import (
    CLASS_COLORS, CLASS_NAMES, DEVICE, FOREST_IDX, IMAGE_SIZE,
    IMAGENET_MEAN, IMAGENET_STD, INFER_BATCH_SIZE, MODEL_PATH,
    NON_FOREST_TARGETS, NUM_CLASSES, PATCH_SIZE, PATCH_STRIDE,
)
from ml.training.trainer import build_resnet50

logger = logging.getLogger(__name__)


# ── Result Dataclasses ────────────────────────────────────────────────────────

@dataclass
class ClassificationResult:
    predicted_class:  str
    predicted_index:  int
    confidence:       float                    # 0.0 – 1.0
    probabilities:    Dict[str, float]         # class_name → probability
    annotated_image:  Optional[str] = None     # base64 PNG


@dataclass
class LandCoverGrid:
    grid:          np.ndarray   # 2D (n_rows, n_cols) of class indices
    image_array:   np.ndarray   # full image (H, W, 3) uint8
    patch_size:    int
    stride:        int
    class_names:   List[str]    = field(default_factory=lambda: CLASS_NAMES)
    colormap_png:  Optional[str] = None   # base64 PNG of land cover map


@dataclass
class ChangeDetectionResult:
    n_deforested:         int
    area_km2:             float
    forest_coverage_2018: float          # 0.0–1.0
    forest_coverage_2024: float
    percent_change:       float          # negative = loss
    change_mask:          np.ndarray     # bool (rows, cols)
    heatmap_png:          Optional[str] = None   # base64 PNG
    change_by_class:      Dict[str, int] = field(default_factory=dict)


# ── Transform ─────────────────────────────────────────────────────────────────

_INFER_TRANSFORM = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


def _pil_to_base64(img: Image.Image, fmt: str = "PNG") -> str:
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return base64.b64encode(buf.getvalue()).decode()


def _array_to_base64(arr: np.ndarray) -> str:
    """Convert (H,W,3) uint8 array to base64 PNG string."""
    return _pil_to_base64(Image.fromarray(arr.astype(np.uint8)))


def _fig_to_base64(fig: plt.Figure) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="PNG", dpi=120, bbox_inches="tight")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode()


# ── Main Class ────────────────────────────────────────────────────────────────

class ImageClassifier:
    """
    Production inference wrapper for the trained ResNet50.

    Usage::

        clf = ImageClassifier()
        clf.load()
        result = clf.classify_image(pil_image)
        grid   = clf.classify_large(large_pil_image)
        change = clf.compare_grids(grid_2018, grid_2024)
    """

    def __init__(
        self,
        checkpoint_path: Path = MODEL_PATH,
        device:          torch.device = DEVICE,
    ):
        self.checkpoint_path = Path(checkpoint_path)
        self.device          = device
        self.model           = None
        self._is_stub        = False   # True when no real checkpoint exists

    def load(self) -> None:
        """Load model from checkpoint, or initialise a stub if not trained yet."""
        model = build_resnet50(freeze_backbone=False).to(self.device)

        if self.checkpoint_path.exists():
            ckpt = torch.load(self.checkpoint_path, map_location=self.device)
            model.load_state_dict(ckpt["state_dict"])
            logger.info("Model loaded from %s (val_acc=%.4f)",
                        self.checkpoint_path, ckpt.get("val_acc", 0))
        else:
            logger.warning(
                "No checkpoint found at %s — using stub model (random weights). "
                "Run `python scripts/train.py` to train.", self.checkpoint_path
            )
            self._is_stub = True

        model.eval()
        self.model = model

    # ── Single-image classification ───────────────────────────────────────────

    @torch.no_grad()
    def classify_image(self, image: Image.Image,
                       return_annotated: bool = True) -> ClassificationResult:
        """
        Classify a single RGB PIL image.

        Returns ClassificationResult with predicted class, confidence,
        full probability distribution, and optionally an annotated image.
        """
        self._check_loaded()
        tensor = _INFER_TRANSFORM(image.convert("RGB")).unsqueeze(0).to(self.device)
        logits = self.model(tensor)
        probs  = F.softmax(logits, dim=1).squeeze().cpu().numpy()

        idx  = int(probs.argmax())
        conf = float(probs[idx])

        annotated = None
        if return_annotated:
            annotated = self._annotate_single(image, CLASS_NAMES[idx], conf, probs)

        return ClassificationResult(
            predicted_class  = CLASS_NAMES[idx],
            predicted_index  = idx,
            confidence       = conf,
            probabilities    = {n: float(p) for n, p in zip(CLASS_NAMES, probs)},
            annotated_image  = annotated,
        )

    # ── Large-image patch inference ───────────────────────────────────────────

    @torch.no_grad()
    def classify_large(
        self, image: Image.Image,
        patch_size: int = PATCH_SIZE,
        stride: int = PATCH_STRIDE,
        return_colormap: bool = True,
    ) -> LandCoverGrid:
        """
        Patchify a large satellite image, classify each patch, and
        reconstruct a 2D land cover grid.
        """
        self._check_loaded()
        arr  = np.array(image.convert("RGB"))
        H, W = arr.shape[:2]

        n_rows = (H - patch_size) // stride + 1
        n_cols = (W - patch_size) // stride + 1

        patches = []
        for r in range(n_rows):
            for c in range(n_cols):
                y0, x0 = r * stride, c * stride
                patch  = Image.fromarray(arr[y0:y0+patch_size, x0:x0+patch_size])
                patches.append(_INFER_TRANSFORM(patch))

        all_preds = []
        for i in range(0, len(patches), INFER_BATCH_SIZE):
            batch  = torch.stack(patches[i:i+INFER_BATCH_SIZE]).to(self.device)
            logits = self.model(batch)
            preds  = logits.argmax(dim=1).cpu().tolist()
            all_preds.extend(preds)

        grid = np.array(all_preds).reshape(n_rows, n_cols)

        colormap_b64 = None
        if return_colormap:
            colormap_b64 = self._render_landcover_map(grid)

        return LandCoverGrid(
            grid        = grid,
            image_array = arr,
            patch_size  = patch_size,
            stride      = stride,
            colormap_png = colormap_b64,
        )

    # ── Change detection ──────────────────────────────────────────────────────

    def compare_grids(
        self,
        grid_2018: LandCoverGrid,
        grid_2024: LandCoverGrid,
        return_heatmap: bool = True,
    ) -> ChangeDetectionResult:
        """
        Compare two LandCoverGrids and detect forest→non-forest transitions.
        """
        g18 = grid_2018.grid
        g24 = grid_2024.grid

        # Align to minimum common extent
        min_r = min(g18.shape[0], g24.shape[0])
        min_c = min(g18.shape[1], g24.shape[1])
        g18, g24 = g18[:min_r, :min_c], g24[:min_r, :min_c]

        was_forest      = (g18 == FOREST_IDX)
        became_nonforest = np.isin(g24, NON_FOREST_TARGETS)
        change_mask     = was_forest & became_nonforest

        n_deforested    = int(change_mask.sum())
        total_patches   = g18.size
        area_km2        = n_deforested * (PATCH_SIZE * 10) ** 2 / 1e6

        forest_2018 = float(was_forest.sum() / total_patches)
        forest_2024 = float((g24 == FOREST_IDX).sum() / total_patches)
        pct_change  = (forest_2024 - forest_2018) / (forest_2018 + 1e-9) * 100

        # Count transitions by destination class
        change_by_class = {}
        dr, dc = np.where(change_mask)
        for dest_idx in np.unique(g24[dr, dc]):
            cnt = int((g24[dr, dc] == dest_idx).sum())
            change_by_class[CLASS_NAMES[dest_idx]] = cnt

        heatmap_b64 = None
        if return_heatmap:
            heatmap_b64 = self._render_change_heatmap(g18, g24, change_mask)

        return ChangeDetectionResult(
            n_deforested         = n_deforested,
            area_km2             = area_km2,
            forest_coverage_2018 = forest_2018,
            forest_coverage_2024 = forest_2024,
            percent_change       = pct_change,
            change_mask          = change_mask,
            heatmap_png          = heatmap_b64,
            change_by_class      = change_by_class,
        )

    # ── Visualisation helpers ─────────────────────────────────────────────────

    def _annotate_single(self, image: Image.Image, cls: str,
                          conf: float, probs: np.ndarray) -> str:
        """Return base64 PNG of the image alone, without subplots/charts."""
        return _pil_to_base64(image)

    def _render_landcover_map(self, grid: np.ndarray) -> str:
        cmap  = mcolors.ListedColormap(CLASS_COLORS)
        norm  = mcolors.BoundaryNorm(np.arange(-0.5, NUM_CLASSES, 1), cmap.N)
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.imshow(grid, cmap=cmap, norm=norm, interpolation="nearest")
        ax.axis("off")
        ax.set_title("Land Cover Map", fontsize=12, fontweight="bold")
        patches = [mpatches.Patch(color=CLASS_COLORS[i], label=CLASS_NAMES[i])
                   for i in range(NUM_CLASSES)]
        ax.legend(handles=patches, bbox_to_anchor=(1.01, 1), loc="upper left", fontsize=8)
        plt.tight_layout()
        return _fig_to_base64(fig)

    def _render_change_heatmap(self, g18: np.ndarray, g24: np.ndarray,
                                mask: np.ndarray) -> str:
        cmap  = mcolors.ListedColormap(CLASS_COLORS)
        norm  = mcolors.BoundaryNorm(np.arange(-0.5, NUM_CLASSES, 1), cmap.N)

        fig, axes = plt.subplots(1, 3, figsize=(18, 5))
        fig.suptitle("Deforestation Change Detection", fontsize=13, fontweight="bold")

        axes[0].imshow(g18, cmap=cmap, norm=norm, interpolation="nearest")
        axes[0].set_title("Land Cover — Year 1", fontweight="bold"); axes[0].axis("off")

        axes[1].imshow(g24, cmap=cmap, norm=norm, interpolation="nearest")
        axes[1].set_title("Land Cover — Year 2", fontweight="bold"); axes[1].axis("off")

        overlay = np.stack([g24 / (NUM_CLASSES - 1)] * 3, axis=-1).copy()
        overlay[mask] = [1.0, 0.1, 0.1]
        axes[2].imshow(overlay, interpolation="nearest")
        axes[2].set_title(f"Deforestation (n={mask.sum():,})", fontweight="bold")
        axes[2].axis("off")

        patches = [mpatches.Patch(color=CLASS_COLORS[i], label=CLASS_NAMES[i])
                   for i in range(NUM_CLASSES)]
        fig.legend(handles=patches, loc="lower center", ncol=5, fontsize=7,
                   bbox_to_anchor=(0.5, -0.05))
        plt.tight_layout()
        return _fig_to_base64(fig)

    def _check_loaded(self) -> None:
        if self.model is None:
            raise RuntimeError("Call .load() before inference.")
