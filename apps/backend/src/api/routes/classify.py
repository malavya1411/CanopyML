"""
POST /api/classify — classify a single satellite image.
"""
from __future__ import annotations

from fastapi import APIRouter, File, UploadFile

try:
    from apps.backend.src.api.controllers.classify_controller import classify_controller
    from apps.backend.src.schemas.schemas import ClassificationResponse
except ImportError:
    from src.api.controllers.classify_controller import classify_controller
    from src.schemas.schemas import ClassificationResponse

router = APIRouter(prefix="/api/classify", tags=["classification"])


@router.post("", response_model=ClassificationResponse)
async def classify_image(
    file: UploadFile = File(...),
    return_annotated: bool = True,
) -> ClassificationResponse:
    """
    Classify a satellite image into one of 10 EuroSAT land cover classes.
    """
    return await classify_controller.classify_image(file, return_annotated=return_annotated)
