from fastapi import APIRouter, Depends, BackgroundTasks, Query

from src.services.sailor_create_requests import SailorsCreateRequestsService
from src.api.v1.dependencies import sailor_create_requests_service_dependency

from src.services.sailors import SailorService
from src.api.v1.dependencies import sailor_service_dependency

from src.services.email import EmailService
from src.api.v1.dependencies import email_service_dependency

from src.api.v1.schemas.sailor_create_request import SailorsCreateRequestSet, SailorsCreateRequestGet
from uuid import UUID
from typing import Annotated, Optional, List
from authx import RequestToken
from src.security.security import security
from fastapi import HTTPException

router = APIRouter(
    prefix="/sailor-create-requests",
    tags=["sailor-create-requests"]
)


@router.get("/", response_model=List[SailorsCreateRequestGet])
async def show_sailor_create_request(
        sailors_create_requests_service: Annotated[SailorsCreateRequestsService, Depends(sailor_create_requests_service_dependency)],
        offset: int = 0,
        limit: int = 10,
        token: RequestToken = Depends(security.get_access_token_from_request),
        order_by: Optional[List[str]] = Query(None, description="Сортировка: -field для DESC", example="['last_name', '-school_number']"),
        search: Optional[str] = Query(None, description="Фраза для поиска"),
        filters: Optional[str] = Query(None, description="Фильтры в формате JSON.", example='{"поле": ["значение", "значение"], "поле": значение}')
):
    return await sailors_create_requests_service.get_requests(
        limit=limit,
        offset=offset,
        order_by=order_by,
        search=search,
        filters=filters)


@router.delete("/delete/{request_id}")
async def delete_sailor_create_request(
        request_id: UUID,
        sailors_create_requests_service: Annotated[SailorsCreateRequestsService, Depends(sailor_create_requests_service_dependency)],
        token: RequestToken = Depends(security.get_access_token_from_request)
):
    return await sailors_create_requests_service.delete_request(request_id)


@router.post("/approve/{request_id}")
async def approve_sailor_create_request(
        request_id: UUID,
        background_tasks: BackgroundTasks,
        sailors_create_requests_service: Annotated[SailorsCreateRequestsService, Depends(sailor_create_requests_service_dependency)],
        sailors_service: Annotated[SailorService, Depends(sailor_service_dependency)],
        email_service: Annotated[EmailService, Depends(email_service_dependency)],
        token: RequestToken = Depends(security.get_access_token_from_request)
):
    status_update_result = await sailors_create_requests_service.approve_request(request_id)
    if status_update_result:
        new_sailor_data = await sailors_create_requests_service.get_sailor_data_from_request(request_id)
        if not new_sailor_data:
            raise HTTPException(status_code=404, detail="Заявка не найдена")
        new_sailor = await sailors_service.add_sailor(new_sailor_data)
        background_tasks.add_task(
            email_service.send_email,
            email_service.create_email_request_on_sailor_request_approve(
                status_update_result.user_email,
                status_update_result.user_fullname,
                sailor_fullname=new_sailor.name + " " + new_sailor.surname + " " + new_sailor.patronymic,
                biography_id=new_sailor.id)
        )
        return new_sailor


@router.post("/reject/{request_id}")
async def reject_sailor_create_request(
    request_id: UUID,
    background_tasks: BackgroundTasks,
    sailors_create_requests_service: Annotated[SailorsCreateRequestsService, Depends(sailor_create_requests_service_dependency)],
    email_service: Annotated[EmailService, Depends(email_service_dependency)],
    token: RequestToken = Depends(security.get_access_token_from_request)
):
    updated_request = await sailors_create_requests_service.reject_request(request_id)
    if updated_request:
        background_tasks.add_task(
            email_service.send_email,
            email_service.create_email_request_on_sailor_request_reject(
                updated_request.user_email,
                updated_request.user_fullname,
                sailor_fullname=updated_request.name + " " + updated_request.surname + " " + updated_request.patronymic)
        )
    return updated_request


@router.put("/update/{request_id}")
async def update_sailor_create_request(
        request_id: UUID,
        data: SailorsCreateRequestSet,
        sailors_create_requests_service: Annotated[
        SailorsCreateRequestsService, Depends(sailor_create_requests_service_dependency)],
        token: RequestToken = Depends(security.get_access_token_from_request)
):
    ...