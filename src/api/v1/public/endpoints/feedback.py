from fastapi import APIRouter, Request, Depends
from src.api.v1.schemas.feedback import FeedbackIdentified
from src.services.feedbacks import FeedbacksService
from src.api.v1.dependencies import feedback_service_dependency
from src.api.v1.schemas.feedback import Feedback
from slowapi import Limiter
from slowapi.util import get_remote_address
from typing import Annotated


limiter = Limiter(key_func=get_remote_address)


router = APIRouter(
    prefix="/feedbacks",
    tags=["feedbacks"]
)


@limiter.limit("5/minute")
@router.post("/create", response_model=FeedbackIdentified)
async def create_feedback_route(
        request: Request,
        data: Feedback,
        feedbacks_service: Annotated[FeedbacksService, Depends(feedback_service_dependency)],
):
    return await feedbacks_service.add_feedback(data)
