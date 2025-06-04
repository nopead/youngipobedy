from src.repository.base import AbstractRepository
from uuid import UUID
from sqlalchemy import select
from fastapi import HTTPException
from src.database.database import async_session_maker


class SQLAlchemyRepository(AbstractRepository):
    model = None

    async def get_by_id(self, item_id: int | UUID, filters: dict | None = None):
        async with async_session_maker() as session:
            try:
                stmt = select(self.model).where(self.model.id == item_id)
                if filters:
                    for field, value in filters.items():
                        stmt = stmt.where(getattr(self.model, field) == value)
                result = await session.execute(stmt)
                item = result.scalars().first()
                if not item:
                    filter_msg = f" и фильтрами {filters}" if filters else ""
                    raise HTTPException(
                        status_code=404,
                        detail=f"{self.model.__name__} с ID {item_id}{filter_msg} не найден"
                    )
                return item
            except Exception as e:
                await session.rollback()
                raise HTTPException(status_code=500, detail=f"Ошибка при получении данных: {str(e)}")

    async def get(self, limit: int, offset: int, filters: dict | None = None):
        async with async_session_maker() as session:
            try:
                stmt = select(self.model)
                if filters:
                    conditions = []
                    for field, value in filters.items():
                        if isinstance(value, list):
                            conditions.append(getattr(self.model, field).in_(value))
                        else:
                            conditions.append(getattr(self.model, field) == value)
                    stmt = stmt.where(*conditions)
                stmt = stmt.limit(limit).offset(offset)
                result = await session.execute(stmt)
                return result.scalars().all()
            except Exception as e:
                await session.rollback()
                raise HTTPException(status_code=500, detail=f"Ошибка при получении данных: {str(e)}")

    async def add(self, data: dict) -> dict:
        async with async_session_maker() as session:
            try:
                obj = self.model(**data)
                session.add(obj)
                await session.commit()
                await session.refresh(obj)
                return obj
            except Exception as e:
                await session.rollback()
                raise HTTPException(status_code=500, detail=f"Ошибка при создании: {str(e)}")

    async def update(self, data: dict):
        async with async_session_maker() as session:
            try:
                obj = await self.get_by_id(data.get('id'))

                for key, value in data.items():
                    setattr(obj, key, value)

                session.add(obj)
                await session.commit()
                await session.refresh(obj)
                return obj
            except Exception as e:
                await session.rollback()
                raise HTTPException(status_code=500, detail=f"Ошибка при обновлении данных: {str(e)}")

    async def delete(self, item_id: int | UUID):
        async with async_session_maker() as session:
            try:
                obj = await self.get_by_id(item_id)
                await session.delete(obj)
                await session.commit()
            except HTTPException:
                raise
            except Exception as e:
                await session.rollback()
                raise HTTPException(status_code=500, detail=f"Ошибка при удалении: {str(e)}")
