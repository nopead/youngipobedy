from fastapi import APIRouter, Depends, Query
from src.api.v1.dependencies import feedback_service_dependency
from src.services.feedbacks import FeedbacksService
from typing import Annotated, Optional, List
from src.api.v1.schemas.feedback import FeedbackIdentified
from authx import RequestToken
from src.security.security import security


router = APIRouter(
    prefix="/feedbacks",
    tags=["feedbacks"]
)


@router.get("/", response_model=list[FeedbackIdentified])
async def show_feedbacks(
        feedbacks_service: Annotated[FeedbacksService, Depends(feedback_service_dependency)],
        offset: int = 0,
        limit: int = 100,
        token: RequestToken = Depends(security.get_access_token_from_request),
        order_by: Optional[List[str]] = Query(None, description="Сортировка: -field для DESC", example="['last_name', '-school_number']"),
        search: Optional[str] = Query(None, description="Фраза для поиска"),
        filters: Optional[str] = Query(None, description="Фильтры в формате JSON.", example='{"поле": ["значение", "значение"], "поле": значение}')
):
    return await feedbacks_service.get_feedbacks(
        limit=limit,
        offset=offset,
        order_by=order_by,
        search=search,
        filters=filters)


@router.delete("/delete/{feedback_id}", response_model=None)
async def delete_feedback(
        feedback_id: int,
        feedbacks_service: Annotated[FeedbacksService, Depends(feedback_service_dependency)],
        token: RequestToken = Depends(security.get_access_token_from_request),
):
    return await feedbacks_service.delete_feedback(feedback_id)
