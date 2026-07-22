"""
Model Controller
Handles fetching model info and evaluation metrics.
"""
from __future__ import annotations

from fastapi import HTTPException

try:
    from apps.backend.src.schemas.schemas import ModelInfoResponse, ModelMetricsResponse
    from apps.backend.src.services.ml_service import ml_service
except ImportError:
    from src.schemas.schemas import ModelInfoResponse, ModelMetricsResponse
    from src.services.ml_service import ml_service


class ModelController:
    @staticmethod
    def get_model_info() -> ModelInfoResponse:
        try:
            info = ml_service.get_model_info()
            return ModelInfoResponse(**info)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))

    @staticmethod
    def get_model_metrics() -> ModelMetricsResponse:
        try:
            m = ml_service.get_metrics()
            return ModelMetricsResponse(
                accuracy=m.get("accuracy"),
                precision=m.get("precision"),
                recall=m.get("recall"),
                f1=m.get("f1"),
                per_class=m.get("per_class"),
                training_history=m.get("training_history"),
                confusion_matrix_png=m.get("confusion_matrix_png"),
                training_curves_png=m.get("training_curves_png"),
            )
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))


model_controller = ModelController()
