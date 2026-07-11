"""
GET /api/model — model info and metrics.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from backend.models.schemas import ModelInfoResponse, ModelMetricsResponse
from backend.services.ml_service import ml_service

router = APIRouter(prefix="/api/model", tags=["model"])


@router.get("", response_model=ModelInfoResponse)
def get_model_info() -> ModelInfoResponse:
    """Return model version, accuracy, class list, and training status."""
    try:
        info = ml_service.get_model_info()
        return ModelInfoResponse(**info)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/metrics", response_model=ModelMetricsResponse)
def get_model_metrics() -> ModelMetricsResponse:
    """Return full evaluation metrics, training history, and chart PNGs (base64)."""
    try:
        m = ml_service.get_metrics()
        return ModelMetricsResponse(
            accuracy             = m.get("accuracy"),
            precision            = m.get("precision"),
            recall               = m.get("recall"),
            f1                   = m.get("f1"),
            per_class            = m.get("per_class"),
            training_history     = m.get("training_history"),
            confusion_matrix_png = m.get("confusion_matrix_png"),
            training_curves_png  = m.get("training_curves_png"),
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
