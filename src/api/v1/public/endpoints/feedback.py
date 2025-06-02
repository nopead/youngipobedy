from fastapi import APIRouter, HTTPException, Request

from starlette import status

from src.repository.sqlalchemy.feedbacks import create_feedback

from src.api.v1.schemas.feedback import FeedbackCreate

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/feedbacks",
    tags=["feedbacks"]
)


@limiter.limit("5/minute")
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_feedback_route(
        request: Request,
        data: FeedbackCreate,
):
    try:
        ...
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
