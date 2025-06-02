from fastapi import APIRouter
from src.api.v1.public.public_router import router as public_router
from src.api.v1.protected.protected_router import router as protected_router

router = APIRouter(prefix='/api/v1')

router.include_router(public_router)
router.include_router(protected_router)
