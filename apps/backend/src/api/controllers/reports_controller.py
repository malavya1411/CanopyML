"""
Reports Controller
Handles PDF report generation for single image classification and change detection.
"""
from __future__ import annotations

from pathlib import Path
from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse

try:
    from apps.backend.src.config.config import settings
    from apps.backend.src.schemas.schemas import ReportResponse
    from apps.backend.src.services.ml_service import ml_service
    from apps.backend.src.services.report_service import report_service
    from apps.backend.src.utils.image_utils import load_image_from_bytes, validate_file_size
except ImportError:
    from src.config.config import settings
    from src.schemas.schemas import ReportResponse
    from src.services.ml_service import ml_service
    from src.services.report_service import report_service
    from src.utils.image_utils import load_image_from_bytes, validate_file_size


class ReportsController:
    @staticmethod
    async def classification_report(
        file: UploadFile,
        title: str = "CanopyML Classification Report",
    ) -> ReportResponse:
        data = await file.read()
        try:
            validate_file_size(data, settings.max_upload_size_mb)
            img = load_image_from_bytes(data, file.filename or "")
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

        result = ml_service.classify(img, return_annotated=True)

        pdf_path = report_service.generate_classification_report(
            predicted_class=result.predicted_class,
            confidence=result.confidence,
            probabilities=result.probabilities,
            annotated_image_b64=result.annotated_image,
            title=title,
        )

        return ReportResponse(
            report_id=pdf_path.stem,
            download_url=f"/api/reports/download/{pdf_path.name}",
            filename=pdf_path.name,
            size_bytes=pdf_path.stat().st_size,
            created_at=str(pdf_path.stat().st_mtime),
        )

    @staticmethod
    async def deforestation_report(
        image_before: UploadFile,
        image_after: UploadFile,
        title: str = "CanopyML Deforestation Report",
    ) -> ReportResponse:
        data_b = await image_before.read()
        data_a = await image_after.read()

        try:
            img_b = load_image_from_bytes(data_b, image_before.filename or "")
            img_a = load_image_from_bytes(data_a, image_after.filename or "")
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

        grid_b = ml_service.classify_large(img_b, return_colormap=False)
        grid_a = ml_service.classify_large(img_a, return_colormap=False)
        change = ml_service.compare(grid_b, grid_a, return_heatmap=True)

        pdf_path = report_service.generate_deforestation_report(
            n_deforested=change.n_deforested,
            area_km2=change.area_km2,
            forest_coverage_2018=change.forest_coverage_2018,
            forest_coverage_2024=change.forest_coverage_2024,
            percent_change=change.percent_change,
            change_by_class=change.change_by_class,
            heatmap_b64=change.heatmap_png,
            title=title,
        )

        return ReportResponse(
            report_id=pdf_path.stem,
            download_url=f"/api/reports/download/{pdf_path.name}",
            filename=pdf_path.name,
            size_bytes=pdf_path.stat().st_size,
            created_at=str(pdf_path.stat().st_mtime),
        )

    @staticmethod
    def download_report(filename: str) -> FileResponse:
        path = Path(settings.reports_dir) / filename
        if not path.exists() or path.suffix != ".pdf":
            raise HTTPException(status_code=404, detail="Report not found.")
        return FileResponse(
            path=str(path),
            media_type="application/pdf",
            filename=filename,
        )


reports_controller = ReportsController()
