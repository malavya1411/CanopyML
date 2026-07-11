"""
POST /api/upload — accepts an image file, stores it temporarily, returns file_id.
"""
from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.models.schemas import UploadResponse
from backend.utils.image_utils import load_image_from_bytes, validate_file_size

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)) -> UploadResponse:
    """
    Accept an image upload. Returns a file_id for subsequent API calls.
    Supported formats: PNG, JPG, JPEG, TIFF.
    """
    data = await file.read()

    try:
        validate_file_size(data, settings.max_upload_size_mb)
        img = load_image_from_bytes(data, file.filename or "")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    file_id = uuid.uuid4().hex
    out_path = Path(settings.upload_dir) / f"{file_id}_{file.filename}"
    out_path.write_bytes(data)

    return UploadResponse(
        file_id      = file_id,
        filename     = file.filename or "",
        size_bytes   = len(data),
        content_type = file.content_type or "image/jpeg",
    )
