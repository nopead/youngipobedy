from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession

from uuid import UUID
from typing import Type
from fastapi import HTTPException


class AbstractRepository(ABC):
    @abstractmethod
    async def get_by_id(self, item_id: int | UUID):
        raise NotImplementedError

    @abstractmethod
    async def get(self, limit: int, offset: int, filters: dict | None, order_by: list[str] | None, search: str | None):
        raise NotImplementedError

    @abstractmethod
    async def add(self, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def update(self, item_id: int | UUID, data: dict):
        raise NotImplementedError

    @abstractmethod
    async def delete(self, item_id: int | UUID):
        raise NotImplementedError
