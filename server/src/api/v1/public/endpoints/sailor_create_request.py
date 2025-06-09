from fastapi import APIRouter, Request, Depends, BackgroundTasks
from starlette import status
from src.api.v1.schemas.sailor_create_request import SailorsCreateRequestSet
from src.services.sailor_create_requests import SailorsCreateRequestsService
from src.services.email import EmailService
from src.api.v1.dependencies import sailor_create_requests_service_dependency
from src.api.v1.dependencies import email_service_dependency
from typing import Annotated
from src.config.stage_cfg import limiter


router = APIRouter(
    prefix="/sailor-create-requests",
    tags=["sailor-create-requests"]
)


@router.post("/add", status_code=status.HTTP_201_CREATED)
async def add_sailor_create_request_route(
        request: Request,
        data: SailorsCreateRequestSet,
        background_tasks: BackgroundTasks,
        sailors_create_requests_service: Annotated[
            SailorsCreateRequestsService,
            Depends(sailor_create_requests_service_dependency)
        ],
        email_service: Annotated[EmailService, Depends(email_service_dependency)]
):
    result = await sailors_create_requests_service.add_request(data)
    if result:
        background_tasks.add_task(
            email_service.send_email,
            email_service.create_email_request_on_sailor_add_request_submit(submitted_data=result)
        )
    return result



