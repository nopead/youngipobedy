from src.services.files import FileService
from src.config.stage_cfg import PROJECT_ROOT
import base64


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
    resource_directory = "resources/photos/"
