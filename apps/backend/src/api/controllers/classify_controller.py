"""
Classify Controller
Validates inputs and delegates classification to ML Service.
"""
from __future__ import annotations

import time
from fastapi import HTTPException, UploadFile

try:
    from apps.backend.src.config.config import settings
    from apps.backend.src.schemas.schemas import ClassificationResponse
    from apps.backend.src.services.ml_service import ml_service
    from apps.backend.src.utils.image_utils import load_image_from_bytes, validate_file_size
except ImportError:
    from src.config.config import settings
    from src.schemas.schemas import ClassificationResponse
    from src.services.ml_service import ml_service
    from src.utils.image_utils import load_image_from_bytes, validate_file_size


class ClassifyController:
    @staticmethod
    async def classify_image(
        file: UploadFile,
        return_annotated: bool = True,
    ) -> ClassificationResponse:
        t0 = time.perf_counter()
        data = await file.read()

        try:
            validate_file_size(data, settings.max_upload_size_mb)
            img = load_image_from_bytes(data, file.filename or "")
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

        try:
            result = ml_service.classify(img, return_annotated=return_annotated)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

        elapsed_ms = (time.perf_counter() - t0) * 1000
        return ClassificationResponse(
            predicted_class=result.predicted_class,
            predicted_index=result.predicted_index,
            confidence=result.confidence,
            probabilities=result.probabilities,
            annotated_image=result.annotated_image,
            is_stub_model=ml_service.is_stub,
            processing_ms=elapsed_ms,
        )


classify_controller = ClassifyController()
