from fastapi import APIRouter

from src.api.v1.public.endpoints.feedback import router as feedbacks_router
from src.api.v1.public.endpoints.sailor_create_request import router as sailors_create_request_router
from src.api.v1.public.endpoints.sailors import router as sailors_router

router = APIRouter()

router.include_router(feedbacks_router)
router.include_router(sailors_create_request_router)
router.include_router(sailors_router)
