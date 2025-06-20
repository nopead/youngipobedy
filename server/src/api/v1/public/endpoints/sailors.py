from fastapi import APIRouter, Request, Depends, Query
from fastapi_cache.decorator import cache
from src.api.v1.dependencies import sailor_service_dependency
from uuid import UUID
from src.services.sailors import SailorService
from typing import Annotated, List, Optional
from src.api.v1.schemas.sailor import SailorData, SailorDataIdentified
from src.security.security import limiter

router = APIRouter(
    prefix="/sailors",
    tags=["sailors"]
)


@router.get("/", response_model=List[SailorDataIdentified])
@limiter.limit("10/second", per_method=True)
@limiter.limit("10000/minute", per_method=True)
async def get_sailors(
        request: Request,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        limit: int = Query(100, ge=1, le=100),
        offset: int = Query(0, ge=0),
        order_by: Optional[List[str]] = Query(None, description="Сортировка: -field для DESC.", example="['поле', '-поле']"),
        search: Optional[str] = Query(None, description="Поиск по ФИО"),
        filters: Optional[str] = Query(None, description="Фильтры в формате JSON.", example="{'поле': ['значение'], 'поле': значение}",)
):
    return await sailors_service.get_sailors(
        limit=limit,
        offset=offset,
        filters=filters,
        order_by=order_by,
        search=search)


@router.get("/{sailor_id}", response_model=SailorData)
@limiter.limit("10/second")
@limiter.limit("10000/minute", per_method=True)
async def get_sailor(
        request: Request,
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        sailor_id: UUID,
):
    return await sailors_service.get_sailor_biography(sailor_id)

