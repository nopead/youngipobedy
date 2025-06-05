import os
import uuid
from fastapi import UploadFile
from src.config.stage_cfg import PROJECT_ROOT


class FileService:
    resource_directory = None

    @classmethod
    async def _ensure_directory_exists(cls):
        os.makedirs(PROJECT_ROOT / cls.resource_directory, exist_ok=True)

    @classmethod
    async def save_photo(cls, file: UploadFile) -> str:
        await cls._ensure_directory_exists()

        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        file_path = os.path.join(PROJECT_ROOT / cls.resource_directory, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        return unique_filename
