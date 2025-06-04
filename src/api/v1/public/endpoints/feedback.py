from fastapi import APIRouter, Request, Depends, BackgroundTasks
from src.api.v1.schemas.feedback import FeedbackIdentified
from src.api.v1.schemas.email_request import EmailRequest
from src.services.feedbacks import FeedbacksService
from src.services.email import EmailService

from src.api.v1.dependencies import email_service_dependency
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
        background_tasks: BackgroundTasks,
        feedbacks_service: Annotated[FeedbacksService, Depends(feedback_service_dependency)],
        email_service: Annotated[EmailService, Depends(email_service_dependency)]
):
    result = await feedbacks_service.add_feedback(data)
    print(result)
    if result:
        background_tasks.add_task(
            email_service.send_email,
            email_service.create_email_request_for_feedback_charity(result.email, result.full_name))
    return result
