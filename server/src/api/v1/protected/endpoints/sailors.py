from fastapi import APIRouter, Depends
from uuid import UUID
from src.api.v1.schemas.sailor import SailorData, SailorDataIdentified
from src.api.v1.dependencies import sailor_service_dependency
from src.services.sailors import SailorService
from typing import Annotated
from authx import RequestToken
from src.security.security import security


router = APIRouter(
    prefix="/sailors",
    tags=["sailors"]
)


@router.post("/create", response_model=SailorDataIdentified)
async def create_sailor(
        data: SailorData,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        token: RequestToken = Depends(security.get_access_token_from_request)
):
    return await sailors_service.add_sailor(data)


@router.delete("/delete/{sailor_id}")
async def delete_sailor(
        sailor_id: UUID,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        token: RequestToken = Depends(security.get_access_token_from_request)
):
    return await sailors_service.delete_sailor(sailor_id)


@router.put("/update/{sailor_id}")
async def update_sailor(
        sailor_id: UUID,
        data: SailorData,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        token: RequestToken = Depends(security.get_access_token_from_request)
):
    return sailors_service.update_sailor(sailor_id, data)
