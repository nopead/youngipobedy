from fastapi import APIRouter, Depends, Query
from src.api.v1.dependencies import admin_dependency, feedback_service_dependency
from src.services.feedbacks import FeedbacksService
from typing import Annotated, Optional, List
from src.api.v1.schemas.feedback import FeedbackIdentified


router = APIRouter(
    prefix="/feedbacks",
    tags=["feedbacks"]
)


@router.get("/show", response_model=list[FeedbackIdentified])
async def show_feedbacks(
        auth: admin_dependency,
        feedbacks_service: Annotated[FeedbacksService, Depends(feedback_service_dependency)],
        offset: int = 0,
        limit: int = 20,
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
        auth: admin_dependency
):
    return await feedbacks_service.delete_feedback(feedback_id)
