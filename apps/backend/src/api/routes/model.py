"""
GET /api/model — model info and metrics.
"""
from __future__ import annotations

from fastapi import APIRouter

try:
    from apps.backend.src.api.controllers.model_controller import model_controller
    from apps.backend.src.schemas.schemas import ModelInfoResponse, ModelMetricsResponse
except ImportError:
    from src.api.controllers.model_controller import model_controller
    from src.schemas.schemas import ModelInfoResponse, ModelMetricsResponse

router = APIRouter(prefix="/api/model", tags=["model"])


@router.get("", response_model=ModelInfoResponse)
def get_model_info() -> ModelInfoResponse:
    """Return model version, accuracy, class list, and training status."""
    return model_controller.get_model_info()


@router.get("/metrics", response_model=ModelMetricsResponse)
def get_model_metrics() -> ModelMetricsResponse:
    """Return full evaluation metrics, training history, and chart PNGs (base64)."""
    return model_controller.get_model_metrics()
