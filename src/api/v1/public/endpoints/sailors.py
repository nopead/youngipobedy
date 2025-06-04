from fastapi import APIRouter, Request, Depends
from fastapi_cache.decorator import cache
from src.api.v1.dependencies import sailor_service_dependency
from uuid import UUID
from slowapi import Limiter
from slowapi.util import get_remote_address
from src.services.sailors import SailorService
from typing import Annotated, List
from src.api.v1.schemas.sailor import SailorFullData, SailorShortDataIdentified

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/sailors",
    tags=["sailors"]
)


@limiter.limit("100/minute")
@cache(expire=60 * 30)
@router.get("/", response_model=List[SailorShortDataIdentified])
async def get_sailors(
        request: Request,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        limit: int = 30,
        offset: int = 0,
):
    return await sailors_service.get_sailors(limit=limit, offset=offset)


@limiter.limit("100/minute")
@cache(expire=60 * 5)
@router.get("/biography/{sailor_id}", response_model=SailorFullData)
async def get_sailor_biography(
        request: Request,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        sailor_id: UUID,
):
    return await sailors_service.get_sailor_biography(sailor_id)

