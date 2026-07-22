"""
Compare Controller
Validates baseline and current image inputs and delegates change detection.
"""
from __future__ import annotations

import time
from fastapi import HTTPException, UploadFile

try:
    from apps.backend.src.config.config import settings
    from apps.backend.src.schemas.schemas import ChangeDetectionResponse
    from apps.backend.src.services.ml_service import ml_service
    from apps.backend.src.utils.image_utils import load_image_from_bytes, validate_file_size
except ImportError:
    from src.config.config import settings
    from src.schemas.schemas import ChangeDetectionResponse
    from src.services.ml_service import ml_service
    from src.utils.image_utils import load_image_from_bytes, validate_file_size


class CompareController:
    @staticmethod
    async def compare_images(
        image_before: UploadFile,
        image_after: UploadFile,
        return_heatmap: bool = True,
    ) -> ChangeDetectionResponse:
        t0 = time.perf_counter()

        data_before = await image_before.read()
        data_after = await image_after.read()

        try:
            validate_file_size(data_before, settings.max_upload_size_mb)
            validate_file_size(data_after, settings.max_upload_size_mb)
            img_before = load_image_from_bytes(data_before, image_before.filename or "")
            img_after = load_image_from_bytes(data_after, image_after.filename or "")
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

        try:
            grid_before = ml_service.classify_large(img_before, return_colormap=False)
            grid_after = ml_service.classify_large(img_after, return_colormap=False)
            result = ml_service.compare(grid_before, grid_after, return_heatmap=return_heatmap)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

        elapsed_ms = (time.perf_counter() - t0) * 1000
        return ChangeDetectionResponse(
            n_deforested=result.n_deforested,
            area_km2=result.area_km2,
            forest_coverage_2018=result.forest_coverage_2018,
            forest_coverage_2024=result.forest_coverage_2024,
            percent_change=result.percent_change,
            change_by_class=result.change_by_class,
            heatmap_png=result.heatmap_png,
            processing_ms=elapsed_ms,
        )


compare_controller = CompareController()
