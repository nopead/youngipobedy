import imghdr
from fastapi import UploadFile, HTTPException
from src.services.files import FileService
from src.config.stage_cfg import PROJECT_ROOT
import base64
import os


def create_base64_image_source(photo_url):
    photo_path = PROJECT_ROOT / photo_url.lstrip('/')

    print(photo_path)

    if photo_path.exists():
        print("path_exists")
        photo_data = photo_path.read_bytes()
        photo_base64 = base64.b64encode(photo_data).decode('utf-8')
        photo_extension = photo_path.suffix.lstrip('.').lower()
    else:
        photo_base64 = None
        photo_extension = None

    return f"data:image/{photo_extension};base64,{photo_base64}"


class PhotoService(FileService):
    RESOURCES_DIRECTORY = "resources/photos/"
    VALIDATION_RULES = {
        ".png": {
            "mimes": {"image/png"},
            "format": "png"
        },
        ".jpg": {
            "mimes": {"image/jpeg", "image/jpg"},
            "format": "jpeg"
        },
        ".jpeg": {
            "mimes": {"image/jpeg", "image/jpg"},
            "format": "jpeg"
        },
        ".webp": {
            "mimes": {"image/webp"},
            "format": "webp"
        }
    }

    async def validate_content(self, file: UploadFile):
        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension not in self.VALIDATION_RULES:
            allowed = ", ".join(self.VALIDATION_RULES.keys())
            raise HTTPException(400, f"Invalid file extension. Allowed: {allowed}")

        rules = self.VALIDATION_RULES[file_extension]

        if file.content_type not in rules["mimes"]:
            allowed_mimes = ", ".join(rules["mimes"])
            raise HTTPException(400,
                                f"Invalid MIME type for {file_extension}. Allowed: {allowed_mimes}")

        file.file.seek(0)
        file_signature = file.file.read(32)
        file.file.seek(0)

        detected_format = imghdr.what(None, h=file_signature)
        if not detected_format:
            raise HTTPException(400, "Invalid image content")

        if detected_format != rules["format"]:
            raise HTTPException(400,
                                f"File content is {detected_format}, expected {rules['format']}")
