from src.repository.base import AbstractRepository
from src.api.v1.schemas.sailor_create_request import SailorsCreateRequestSet, SailorsCreateRequestGet
from src.api.v1.schemas.sailor import SailorData
from typing import List, Optional
from uuid import UUID
from src.services.core import parse_filters


class SailorsCreateRequestsService:
    def __init__(self, sailors_create_requests_repo: AbstractRepository):
        self.sailors_create_requests_repo: AbstractRepository = sailors_create_requests_repo()

    async def get_requests(self,limit: int,offset: int,order_by: Optional[List[str]],search: Optional[str],filters: Optional[str]
                           ) -> List[SailorsCreateRequestGet] | None:
        return await self.sailors_create_requests_repo.get(limit=limit,offset=offset,order_by=order_by,search=search,filters=parse_filters(filters))

    async def add_request(self, request: SailorsCreateRequestSet) -> SailorsCreateRequestGet:
        result = await self.sailors_create_requests_repo.add(data=request.model_dump())
        return SailorsCreateRequestGet.model_validate(result)

    async def delete_request(self, request_id: UUID):
        return await self.sailors_create_requests_repo.delete(request_id)

    async def get_sailor_data_from_request(self, request_id: UUID) -> SailorData | None:
        return await self.sailors_create_requests_repo.get_sailor_data(request_id)

    async def approve_request(self, request_id: UUID) -> SailorsCreateRequestGet | None:
        return await self.sailors_create_requests_repo.approve_request(request_id)

    async def reject_request(self, request_id: UUID) -> SailorsCreateRequestGet | None:
        return await self.sailors_create_requests_repo.reject_request(request_id)
