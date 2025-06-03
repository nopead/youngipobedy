from fastapi import APIRouter, Depends
from src.api.v1.dependencies import admin_dependency, feedback_service_dependency
from src.services.feedbacks import FeedbacksService
from typing import Annotated
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
        limit: int = 20
):
    return await feedbacks_service.get_feedbacks(limit, offset)


@router.delete("/delete/{feedback_id}", response_model=None)
async def delete_feedback(
        feedback_id: int,
        feedbacks_service: Annotated[FeedbacksService, Depends(feedback_service_dependency)],
        auth: admin_dependency
):
    return await feedbacks_service.delete_feedback(feedback_id)
