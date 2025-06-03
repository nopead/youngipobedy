from src.repository.base import AbstractRepository
from uuid import UUID
from src.api.v1.schemas.sailor import SailorFullData, SailorFullDataIdentified, SailorShortDataIdentified
from typing import List


class SailorService:
    def __init__(self, sailors_repo: AbstractRepository):
        self.sailors_repo: AbstractRepository = sailors_repo()

    async def get_sailors(self, limit: int, offset: int) -> List[SailorShortDataIdentified]:
        return await self.sailors_repo.get_sailors_card_info(limit=limit, offset=offset)

    async def get_sailor(self, sailor_id: UUID) -> SailorFullData:
        return await self.sailors_repo.get_by_id(item_id=sailor_id)

    async def add_sailor(self, sailor: SailorFullData) -> SailorFullDataIdentified:
        data = sailor.model_dump()
        return await self.sailors_repo.add(data)

    async def update_sailor(self, new_data: SailorFullDataIdentified) -> SailorFullDataIdentified:
        data = new_data.model_dump()
        return await self.sailors_repo.update(data)

    async def delete_sailor(self, sailor_id: UUID):
        return await self.sailors_repo.delete(sailor_id)
