from fastapi import APIRouter, Request, Depends, Query
from fastapi_cache.decorator import cache
from src.api.v1.dependencies import sailor_service_dependency
from uuid import UUID
from slowapi import Limiter
from slowapi.util import get_remote_address
from src.services.sailors import SailorService
from typing import Annotated, List, Optional
from src.api.v1.schemas.sailor import SailorData, SailorDataIdentified


limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/sailors",
    tags=["sailors"]
)


@limiter.limit("100/minute")
@cache(expire=60 * 30)
@router.get("/", response_model=List[SailorDataIdentified])
async def get_sailors(
        request: Request,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        limit: int = Query(30, ge=1, le=100),
        offset: int = Query(0, ge=0),
        order_by: Optional[List[str]] = Query(None, description="Сортировка: -field для DESC.", example="['поле', '-поле']"),
        search: Optional[str] = Query(None, description="Поиск по ФИО"),
        filters: Optional[str] = Query(None, description="Фильтры в формате JSON.", example="{'поле': ['значение'], 'поле': значение}",)
):
    return await sailors_service.get_sailors(limit, offset, filters, order_by, search)


@limiter.limit("100/minute")
@cache(expire=60 * 5)
@router.get("/biography/{sailor_id}", response_model=SailorData)
async def get_sailor_biography(
        request: Request,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        sailor_id: UUID,
):
    return await sailors_service.get_sailor_biography(sailor_id)

