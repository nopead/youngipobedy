from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from typing import Annotated
from src.services.photo import PhotoService
from src.api.v1.dependencies import photo_service_dependency
from src.security.security import limiter


router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/image")
@limiter.limit("5000/minute", per_method=True)
async def upload_image(
        request: Request,
        photo_service: Annotated[PhotoService, Depends(photo_service_dependency)],
        file: UploadFile = File(...)
) -> dict[str, str]:
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    try:
        filename = await photo_service.save(file)
        return {
            "message": "File uploaded successfully",
            "photo_url": filename,
            "content_type": file.content_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")