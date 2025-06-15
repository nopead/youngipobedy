import os
import uuid
import imghdr
from pathlib import Path
from fastapi import UploadFile, HTTPException


class FileService:
    STORAGE_URL = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../front/public'))
    RESOURCES_DIRECTORY = None
    VALIDATION_RULES = None

    async def validate_content(self, file: UploadFile):
        pass

    async def save(self, file: UploadFile) -> str:
        print("В методе загрузки файла")

        await self.validate_content(file)

        file_extension = os.path.splitext(file.filename)[1].lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        file_dir = os.path.join(self.STORAGE_URL, self.RESOURCES_DIRECTORY or "")
        os.makedirs(file_dir, exist_ok=True)

        file_path = os.path.join(file_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        print(f"Сохранили файл локально по пути: {file_path}")

        relative_path = os.path.join(self.RESOURCES_DIRECTORY or "", unique_filename)
        return relative_path

    async def delete(self, filename: str) -> bool:
        try:
            file_path = os.path.join(self.STORAGE_URL, filename)
            path_obj = Path(file_path)
            if not path_obj.exists():
                return False
            path_obj.unlink()
            return True
        except OSError as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
