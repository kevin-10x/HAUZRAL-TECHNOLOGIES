"""File upload handling with local filesystem storage."""

import os
import uuid
import aiofiles
from pathlib import Path
from app.config import settings

UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


async def save_upload(file_obj, project_id: int) -> tuple[str, int, str]:
    ext = Path(file_obj.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / str(project_id) / filename
    file_path.parent.mkdir(parents=True, exist_ok=True)

    file_size = 0
    async with aiofiles.open(file_path, "wb") as out_file:
        while chunk := await file_obj.read(1024 * 1024):
            await out_file.write(chunk)
            file_size += len(chunk)

    return str(file_path.relative_to(UPLOAD_DIR)), file_size, file_obj.content_type
