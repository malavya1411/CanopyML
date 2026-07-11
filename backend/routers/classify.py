"""
POST /api/classify — classify a single satellite image.
"""
from __future__ import annotations

import time

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.models.schemas import ClassificationResponse
from backend.services.ml_service import ml_service
from backend.utils.image_utils import load_image_from_bytes, validate_file_size
from backend.config import settings

router = APIRouter(prefix="/api/classify", tags=["classification"])


@router.post("", response_model=ClassificationResponse)
async def classify_image(
    file: UploadFile = File(...),
    return_annotated: bool = True,
) -> ClassificationResponse:
    """
    Classify a satellite image into one of 10 EuroSAT land cover classes.

    Returns:
    - predicted_class: top-1 class name
    - confidence: top-1 probability (0–1)
    - probabilities: full distribution over all 10 classes
    - annotated_image: base64 PNG with label overlay (if requested)
    """
    t0   = time.perf_counter()
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
        predicted_class  = result.predicted_class,
        predicted_index  = result.predicted_index,
        confidence       = result.confidence,
        probabilities    = result.probabilities,
        annotated_image  = result.annotated_image,
        is_stub_model    = ml_service.is_stub,
        processing_ms    = elapsed_ms,
    )
