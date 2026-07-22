"""
POST /api/upload — accepts an image file, stores it temporarily, returns file_id.
"""
from __future__ import annotations

from fastapi import APIRouter, File, UploadFile

try:
    from apps.backend.src.api.controllers.upload_controller import upload_controller
    from apps.backend.src.schemas.schemas import UploadResponse
except ImportError:
    from src.api.controllers.upload_controller import upload_controller
    from src.schemas.schemas import UploadResponse

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)) -> UploadResponse:
    """
    Accept an image upload. Returns a file_id for subsequent API calls.
    """
    return await upload_controller.upload_image(file)
