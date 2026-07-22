"""
Shared Python Constants for CanopyML
"""
from __future__ import annotations

CLASS_NAMES = [
    "AnnualCrop",
    "Forest",
    "HerbaceousVegetation",
    "Highway",
    "Industrial",
    "Pasture",
    "PermanentCrop",
    "Residential",
    "River",
    "SeaLake",
]

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

FOREST_IDX = 1
NON_FOREST_TARGETS = [0, 2, 4, 5, 6, 7]

MODEL_VERSION = "1.0.0"
DATASET_VERSION = "EuroSAT-RGB-v2"
