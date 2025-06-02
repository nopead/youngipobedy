from fastapi import APIRouter, Request, HTTPException

from starlette import status

from src.api.v1.schemas.sailor_create_request import SailorCreateRequest

from src.repository.sqlalchemy.sailor_create_requests import add_sailor_create_request

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/sailor-create-requests",
    tags=["sailor-create-requests"]
)


@limiter.limit("5/minute")
@router.post("/add", status_code=status.HTTP_201_CREATED)
async def add_sailor_create_request_route(
        request: Request,
        data: SailorCreateRequest,
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
