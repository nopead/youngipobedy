from fastapi import APIRouter, Depends
from src.api.v1.dependencies import admin_dependency
from uuid import UUID
from src.api.v1.schemas.sailor import SailorData, SailorDataIdentified
from src.api.v1.dependencies import sailor_service_dependency
from src.services.sailors import SailorService
from typing import Annotated



router = APIRouter(
    prefix="/sailors",
    tags=["sailors"]
)


@router.post("/create", response_model=SailorDataIdentified)
async def create_sailor(
        data: SailorData,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        auth: admin_dependency,
):
    return await sailors_service.add_sailor(data)


@router.delete("/delete/{sailor_id}")
async def delete_sailor(
        sailor_id: UUID,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        auth: admin_dependency,
):
    return await sailors_service.delete_sailor(sailor_id)
