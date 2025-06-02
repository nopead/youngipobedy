from fastapi import APIRouter
from src.api.v1.dependencies import admin_dependency, feedback_service_dependency
from src.api.v1.schemas.feedback import FeedbackIdentified
from typing import List

router = APIRouter(
    prefix="/feedbacks",
    tags=["feedbacks"]
)


@router.get("/show", response_model=List[FeedbackIdentified])
async def show_feedbacks(
        feedbacks_service: feedback_service_dependency,
        auth: admin_dependency,
        offset: int = 0,
        limit: int = 20
):
    return await feedbacks_service.get(offset, limit)


@router.delete("/delete/{feedback_id}")
async def delete_feedback(
        feedback_id: int,
        feedbacks_service: feedback_service_dependency,
        auth: admin_dependency
):
    ...
