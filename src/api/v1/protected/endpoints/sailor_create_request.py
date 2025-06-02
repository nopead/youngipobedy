from fastapi import APIRouter

from src.api.v1.dependencies import admin_dependency

from uuid import UUID


router = APIRouter(
    prefix="/sailor-create-requests",
    tags=["sailor-create-requests"]
)


@router.get("/")
async def show_sailor_create_request(
        admin: admin_dependency,
        offset: int = 0,
        limit: int = 10
):
    ...


@router.delete("/delete/{request_id}")
async def delete_sailor_create_request(
        request_id: UUID,
        auth: admin_dependency
):
    ...


@router.post("/approve/{request_id}")
async def approve_sailor_create_request(
        request_id: UUID,
        auth: admin_dependency
):
    ...
