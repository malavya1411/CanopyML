"""
POST /api/reports — generate downloadable PDF reports.
"""
from __future__ import annotations

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse

try:
    from apps.backend.src.api.controllers.reports_controller import reports_controller
    from apps.backend.src.schemas.schemas import ReportResponse
except ImportError:
    from src.api.controllers.reports_controller import reports_controller
    from src.schemas.schemas import ReportResponse

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/classification", response_model=ReportResponse)
async def classification_report(
    file: UploadFile = File(...),
    title: str = "CanopyML Classification Report",
) -> ReportResponse:
    """Generate a PDF report for a classification result."""
    return await reports_controller.classification_report(file, title=title)


@router.post("/deforestation", response_model=ReportResponse)
async def deforestation_report(
    image_before: UploadFile = File(...),
    image_after: UploadFile = File(...),
    title: str = "CanopyML Deforestation Report",
) -> ReportResponse:
    """Generate a PDF report for a deforestation detection result."""
    return await reports_controller.deforestation_report(image_before, image_after, title=title)


@router.get("/download/{filename}")
def download_report(filename: str) -> FileResponse:
    """Serve a generated PDF report for download."""
    return reports_controller.download_report(filename)
