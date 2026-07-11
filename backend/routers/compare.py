"""
POST /api/compare — deforestation detection from two satellite images.
"""
from __future__ import annotations

import time

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.models.schemas import ChangeDetectionResponse
from backend.services.ml_service import ml_service
from backend.utils.image_utils import load_image_from_bytes, validate_file_size
from backend.config import settings

router = APIRouter(prefix="/api/compare", tags=["deforestation"])


@router.post("", response_model=ChangeDetectionResponse)
async def compare_images(
    image_before: UploadFile = File(..., description="Earlier satellite image (baseline)"),
    image_after:  UploadFile = File(..., description="Later satellite image (current)"),
    return_heatmap: bool = True,
) -> ChangeDetectionResponse:
    """
    Detect deforestation by comparing two satellite images from different dates.

    Both images are patchified (64×64 px, stride=64), classified independently,
    and then compared patch-by-patch. Returns statistics and a heatmap overlay.
    """
    t0 = time.perf_counter()

    # Load both images
    data_before = await image_before.read()
    data_after  = await image_after.read()

    try:
        validate_file_size(data_before, settings.max_upload_size_mb)
        validate_file_size(data_after,  settings.max_upload_size_mb)
        img_before = load_image_from_bytes(data_before, image_before.filename or "")
        img_after  = load_image_from_bytes(data_after,  image_after.filename  or "")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # Run patch inference on both images
    try:
        grid_before = ml_service.classify_large(img_before, return_colormap=False)
        grid_after  = ml_service.classify_large(img_after,  return_colormap=False)
        result      = ml_service.compare(grid_before, grid_after, return_heatmap=return_heatmap)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    elapsed_ms = (time.perf_counter() - t0) * 1000
    return ChangeDetectionResponse(
        n_deforested          = result.n_deforested,
        area_km2              = result.area_km2,
        forest_coverage_2018  = result.forest_coverage_2018,
        forest_coverage_2024  = result.forest_coverage_2024,
        percent_change        = result.percent_change,
        change_by_class       = result.change_by_class,
        heatmap_png           = result.heatmap_png,
        processing_ms         = elapsed_ms,
    )
