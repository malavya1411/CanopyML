"""
Upload Controller
Validates uploaded image and stores temporarily.
"""
from __future__ import annotations

import uuid
from pathlib import Path
from fastapi import HTTPException, UploadFile

try:
    from apps.backend.src.config.config import settings
    from apps.backend.src.schemas.schemas import UploadResponse
    from apps.backend.src.utils.image_utils import load_image_from_bytes, validate_file_size
except ImportError:
    from src.config.config import settings
    from src.schemas.schemas import UploadResponse
    from src.utils.image_utils import load_image_from_bytes, validate_file_size


class UploadController:
    @staticmethod
    async def upload_image(file: UploadFile) -> UploadResponse:
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
            file_id=file_id,
            filename=file.filename or "",
            size_bytes=len(data),
            content_type=file.content_type or "image/jpeg",
        )


upload_controller = UploadController()
