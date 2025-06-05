import os
import uuid
from fastapi import UploadFile, HTTPException
from src.config.stage_cfg import PROJECT_ROOT


class FileService:
    RESOURCES_DIRECTORY = None
    VALIDATION_RULES = None

    async def validate_content(self, file: UploadFile):
        ...

    async def _ensure_directory_exists(self):
        os.makedirs(PROJECT_ROOT / self.RESOURCES_DIRECTORY, exist_ok=True)

    async def save(self, file: UploadFile) -> str:
        await self.validate_content(file)
        await self._ensure_directory_exists()

        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        file_path = os.path.join(PROJECT_ROOT / self.RESOURCES_DIRECTORY, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        return unique_filename

    async def delete(self, filename: str) -> bool:
        try:
            file_path = PROJECT_ROOT + self.RESOURCES_DIRECTORY + filename

            if not file_path.exists():
                return False

            file_path.unlink()
            return True

        except OSError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete file: {str(e)}"
            )