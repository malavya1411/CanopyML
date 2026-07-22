"""
CanopyML Backend — Pydantic Schemas
All request/response models for the FastAPI API.
"""
from __future__ import annotations

from pydantic import ConfigDict

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


# ── Classification ────────────────────────────────────────────────────────────

class ClassificationResponse(BaseModel):
    predicted_class:  str
    predicted_index:  int
    confidence:       float = Field(ge=0.0, le=1.0)
    probabilities:    Dict[str, float]
    annotated_image:  Optional[str] = None   # base64 PNG
    is_stub_model:    bool = False
    processing_ms:    float = 0.0


class BatchClassificationResponse(BaseModel):
    results: List[ClassificationResponse]
    total_processing_ms: float


# ── Change Detection ──────────────────────────────────────────────────────────

class ChangeDetectionResponse(BaseModel):
    n_deforested:         int
    area_km2:             float
    forest_coverage_2018: float
    forest_coverage_2024: float
    percent_change:       float
    change_by_class:      Dict[str, int]
    heatmap_png:          Optional[str] = None  # base64 PNG
    processing_ms:        float = 0.0


# ── Model Info ────────────────────────────────────────────────────────────────

class PerClassMetrics(BaseModel):
    precision: float
    recall:    float
    f1_score:  float
    support:   int


class ModelInfoResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    model_version:    str
    dataset_version:  str
    accuracy:         Optional[float] = None
    precision:        Optional[float] = None
    recall:           Optional[float] = None
    f1_score:         Optional[float] = None
    class_names:      List[str]
    num_classes:      int
    is_trained:       bool
    is_stub:          bool
    training_date:    Optional[str] = None
    device:           str


class ModelMetricsResponse(BaseModel):
    accuracy:    Optional[float]
    precision:   Optional[float]
    recall:      Optional[float]
    f1:          Optional[float]
    per_class:   Optional[Dict] = None
    training_history: Optional[Dict] = None
    confusion_matrix_png: Optional[str] = None   # base64
    training_curves_png:  Optional[str] = None   # base64


# ── Upload ────────────────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    file_id:    str
    filename:   str
    size_bytes: int
    content_type: str


# ── Reports ───────────────────────────────────────────────────────────────────

class ReportRequest(BaseModel):
    report_type: str   # "classification" | "deforestation"
    title:       Optional[str] = "CanopyML Report"
    include_charts: bool = True


class ReportResponse(BaseModel):
    report_id:    str
    download_url: str
    filename:     str
    size_bytes:   int
    created_at:   str


# ── Health ────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    status:   str = "ok"
    version:  str
    device:   str
    model_loaded: bool
