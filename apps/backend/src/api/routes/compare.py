"""
POST /api/compare — deforestation detection from two satellite images.
"""
from __future__ import annotations

from fastapi import APIRouter, File, UploadFile

try:
    from apps.backend.src.api.controllers.compare_controller import compare_controller
    from apps.backend.src.schemas.schemas import ChangeDetectionResponse
except ImportError:
    from src.api.controllers.compare_controller import compare_controller
    from src.schemas.schemas import ChangeDetectionResponse

router = APIRouter(prefix="/api/compare", tags=["deforestation"])


@router.post("", response_model=ChangeDetectionResponse)
async def compare_images(
    image_before: UploadFile = File(..., description="Earlier satellite image (baseline)"),
    image_after: UploadFile = File(..., description="Later satellite image (current)"),
    return_heatmap: bool = True,
) -> ChangeDetectionResponse:
    """
    Detect deforestation by comparing two satellite images from different dates.
    """
    return await compare_controller.compare_images(
        image_before, image_after, return_heatmap=return_heatmap
    )
