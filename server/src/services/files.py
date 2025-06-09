import os
import uuid
from fastapi import UploadFile, HTTPException


class FileService:
    STORAGE_URL = "C:/Users/user/Documents/youngipobedy/youngipobedy/front/public/"
    RESOURCES_DIRECTORY = None
    VALIDATION_RULES = None

    async def validate_content(self, file: UploadFile):
        ...

    async def save(self, file: UploadFile) -> str:
        await self.validate_content(file)
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(self.STORAGE_URL, self.RESOURCES_DIRECTORY, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        return file_path

    async def delete(self, filename: str) -> bool:
        try:
            file_path = self.STORAGE_URL + self.RESOURCES_DIRECTORY + filename
            if not file_path.exists():
                return False
            file_path.unlink()
            return True
        except OSError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete file: {str(e)}"
            )