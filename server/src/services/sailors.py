from src.repository.base import AbstractRepository
from uuid import UUID
from src.api.v1.schemas.sailor import SailorData, SailorDataIdentified
from typing import List, Optional
from src.services.core import parse_filters


class SailorService:
    def __init__(self, sailors_repo: AbstractRepository):
        self.sailors_repo: AbstractRepository = sailors_repo()

    async def get_sailors(self,
                          limit: int,
                          offset: int,
                          order_by: Optional[List[str]],
                          search: Optional[str],
                          filters: Optional[str]
                          ) -> List[SailorDataIdentified]:

        return await self.sailors_repo.get(limit, offset, order_by, search, parse_filters(filters))

    async def get_sailor_biography(self, sailor_id: UUID) -> SailorData:
        return await self.sailors_repo.get_by_id(item_id=sailor_id)

    async def add_sailor(self, sailor: SailorData) -> SailorDataIdentified:
        return await self.sailors_repo.add(data=sailor.model_dump())

    async def update_sailor(self, sailor_id: UUID, new_data: SailorData) -> SailorDataIdentified:
        return await self.sailors_repo.update(sailor_id ,data=new_data.model_dump())

    async def delete_sailor(self, sailor_id: UUID):
        return await self.sailors_repo.delete(item_id=sailor_id)
