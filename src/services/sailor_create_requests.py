from src.repository.base import AbstractRepository
from src.api.v1.schemas.sailor_create_request import SailorsCreateRequestSet, SailorsCreateRequestGet

from typing import List, Annotated

from fastapi import Depends
from uuid import UUID


class SailorsCreateRequestsService:
    def __init__(self, sailors_create_requests_repo: AbstractRepository):
        self.sailors_create_requests_repo: AbstractRepository = sailors_create_requests_repo()

    async def get_requests(self, limit: int, offset: int) -> List[SailorsCreateRequestGet]:
        return await self.sailors_create_requests_repo.get(limit=limit, offset=offset)

    async def add_request(self, request: SailorsCreateRequestSet) -> SailorsCreateRequestGet:
        data = request.model_dump()
        result = await self.sailors_create_requests_repo.add(data)
        return SailorsCreateRequestGet.model_validate(result)

    async def delete_request(self, request_id: UUID):
        return await self.sailors_create_requests_repo.delete(request_id)

    async def get_sailor_data_from_request(self, request_id: UUID):
        return await self.sailors_create_requests_repo.get_sailors_data(request_id)

    async def approve_request(self, request_id: UUID):
        return await self.sailors_create_requests_repo.approve_request(request_id)

    async def reject_request(self, request_id: UUID):
        return await self.sailors_create_requests_repo.reject_request(request_id)
