"""
ML Service — Singleton wrapper around ImageClassifier.
Handles lazy loading, thread-safe inference, and model metadata.
"""
from __future__ import annotations

import json
import logging
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

from PIL import Image

from ml.config import (
    CLASS_NAMES, DATASET_VERSION, DEVICE,
    METRICS_PATH, MODEL_PATH, MODEL_VERSION, NUM_CLASSES,
)
from ml.inference.classifier import (
    ChangeDetectionResult, ClassificationResult,
    ImageClassifier, LandCoverGrid,
)

logger = logging.getLogger(__name__)
_lock = threading.Lock()


class MLService:
    """
    Application-level singleton for ML inference.
    Loaded once on startup; all routes share a single model instance.
    """

    _instance: Optional["MLService"] = None

    def __init__(self) -> None:
        self._classifier: Optional[ImageClassifier] = None
        self._loaded = False
        self._training_date: Optional[str] = None

    # ── Singleton factory ─────────────────────────────────────────────────────

    @classmethod
    def get_instance(cls) -> "MLService":
        if cls._instance is None:
            with _lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    # ── Lifecycle ─────────────────────────────────────────────────────────────

    def load(self) -> None:
        """Load the model (safe to call multiple times — idempotent)."""
        if self._loaded:
            return
        with _lock:
            if self._loaded:
                return
            logger.info("Loading CanopyML model…")
            clf = ImageClassifier(checkpoint_path=MODEL_PATH, device=DEVICE)
            clf.load()
            self._classifier = clf
            self._loaded = True

            # Read training date from checkpoint if available
            if MODEL_PATH.exists():
                import torch
                ckpt = torch.load(MODEL_PATH, map_location="cpu")
                self._training_date = ckpt.get("training_date",
                                                datetime.now().isoformat())
            logger.info("Model loaded. Stub=%s", clf._is_stub)

    # ── Inference methods ─────────────────────────────────────────────────────

    def classify(self, image: Image.Image,
                 return_annotated: bool = True) -> ClassificationResult:
        self._ensure_loaded()
        return self._classifier.classify_image(image, return_annotated=return_annotated)

    def classify_large(self, image: Image.Image,
                       return_colormap: bool = True) -> LandCoverGrid:
        self._ensure_loaded()
        return self._classifier.classify_large(image, return_colormap=return_colormap)

    def compare(self, grid_2018: LandCoverGrid,
                grid_2024: LandCoverGrid,
                return_heatmap: bool = True) -> ChangeDetectionResult:
        self._ensure_loaded()
        return self._classifier.compare_grids(grid_2018, grid_2024, return_heatmap)

    # ── Model metadata ────────────────────────────────────────────────────────

    def get_model_info(self) -> dict:
        self._ensure_loaded()
        metrics = self._load_metrics()
        return {
            "model_version":   MODEL_VERSION,
            "dataset_version": DATASET_VERSION,
            "accuracy":        metrics.get("accuracy") if metrics else None,
            "precision":       metrics.get("precision") if metrics else None,
            "recall":          metrics.get("recall") if metrics else None,
            "f1_score":        metrics.get("f1") if metrics else None,
            "class_names":     CLASS_NAMES,
            "num_classes":     NUM_CLASSES,
            "is_trained":      MODEL_PATH.exists(),
            "is_stub":         self._classifier._is_stub if self._classifier else True,
            "training_date":   self._training_date,
            "device":          str(DEVICE),
        }

    def get_metrics(self) -> dict:
        self._ensure_loaded()
        from logs import training_history_path  # avoid circular
        metrics  = self._load_metrics() or {}
        history  = self._load_history()
        cm_png   = self._load_png_b64(Path("logs/evaluation/confusion_matrix.png"))
        curve_png = self._load_png_b64(Path("logs/evaluation/training_curves.png"))
        return {
            **metrics,
            "training_history":      history,
            "confusion_matrix_png":  cm_png,
            "training_curves_png":   curve_png,
        }

    @property
    def is_stub(self) -> bool:
        return self._classifier._is_stub if self._classifier else True

    # ── Private ───────────────────────────────────────────────────────────────

    def _ensure_loaded(self) -> None:
        if not self._loaded:
            self.load()

    def _load_metrics(self) -> Optional[dict]:
        if METRICS_PATH.exists():
            with open(METRICS_PATH) as f:
                return json.load(f)
        return None

    def _load_history(self) -> Optional[dict]:
        history_path = Path("logs/training_history.json")
        if history_path.exists():
            with open(history_path) as f:
                return json.load(f)
        return None

    def _load_png_b64(self, path: Path) -> Optional[str]:
        if path.exists():
            import base64
            return base64.b64encode(path.read_bytes()).decode()
        return None


# Module-level singleton access
ml_service = MLService.get_instance()
