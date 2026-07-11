"""
CanopyML — Central Configuration
All hyperparameters, paths, and class definitions in one place.
"""
from __future__ import annotations
import os
from pathlib import Path
import torch

# ── Root Paths ────────────────────────────────────────────────────────────────
ROOT          = Path(__file__).parent.parent.resolve()
DATASET_DIR   = ROOT / "dataset" / "EuroSAT_RGB"
SAVED_MODELS  = ROOT / "saved_models"
LOGS_DIR      = ROOT / "logs"
REPORTS_DIR   = ROOT / "reports"
EVAL_DIR      = LOGS_DIR / "evaluation"
TB_DIR        = LOGS_DIR / "tensorboard"
HISTORY_PATH  = LOGS_DIR / "training_history.json"
MODEL_PATH    = SAVED_MODELS / "best_model.pth"
METRICS_PATH  = EVAL_DIR / "metrics.json"

# Create output dirs on import
for d in [SAVED_MODELS, LOGS_DIR, EVAL_DIR, TB_DIR, REPORTS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# ── Dataset ───────────────────────────────────────────────────────────────────
EUROSAT_URL       = "https://madm.dfki.de/files/sentinel/EuroSAT.zip"
EUROSAT_ZIP_NAME  = "EuroSAT.zip"
NUM_CLASSES       = 10
IMAGE_SIZE        = 224

# EuroSAT class names (alphabetical = ImageFolder default order)
CLASS_NAMES = [
    "AnnualCrop",    # 0
    "Forest",        # 1  ← key for deforestation detection
    "HerbaceousVegetation",  # 2
    "Highway",       # 3
    "Industrial",    # 4
    "Pasture",       # 5
    "PermanentCrop", # 6
    "Residential",   # 7
    "River",         # 8
    "SeaLake",       # 9
]

FOREST_IDX         = 1
NON_FOREST_TARGETS = [0, 2, 4, 5, 6, 7]  # classes that count as deforestation

# Visual colormap for land cover (hex, one per class)
CLASS_COLORS = [
    "#f5c242",  # AnnualCrop
    "#2d8c4e",  # Forest
    "#a8d5a2",  # HerbaceousVegetation
    "#8c8c8c",  # Highway
    "#e05c2e",  # Industrial
    "#c8e6c9",  # Pasture
    "#f9a825",  # PermanentCrop
    "#ef5350",  # Residential
    "#1565c0",  # River
    "#29b6f6",  # SeaLake
]

# ── Training Hyperparameters ──────────────────────────────────────────────────
BATCH_SIZE            = 32
STAGE_A_EPOCHS        = 10    # head-only transfer learning
STAGE_B_EPOCHS        = 20    # full fine-tuning
STAGE_A_LR            = 1e-3
STAGE_B_LR            = 1e-4
WEIGHT_DECAY          = 1e-4
EARLY_STOP_PATIENCE   = 5
LR_SCHEDULER_PATIENCE = 3

# ── Inference ─────────────────────────────────────────────────────────────────
PATCH_SIZE        = 64
PATCH_STRIDE      = 64
INFER_BATCH_SIZE  = 64

# ── Split ─────────────────────────────────────────────────────────────────────
TRAIN_RATIO  = 0.80
VAL_RATIO    = 0.10
TEST_RATIO   = 0.10
RANDOM_SEED  = 42

# ── Device ────────────────────────────────────────────────────────────────────
DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else
    "mps"  if torch.backends.mps.is_available() else
    "cpu"
)

# ── ImageNet normalisation stats ──────────────────────────────────────────────
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

# ── Model versioning ──────────────────────────────────────────────────────────
MODEL_VERSION    = "1.0.0"
DATASET_VERSION  = "EuroSAT-RGB-v2"
