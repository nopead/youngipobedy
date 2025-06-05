from src.repository.base import AbstractRepository
from uuid import UUID
from sqlalchemy import select
from fastapi import HTTPException
from src.database.database import async_session_maker
from sqlalchemy import or_, asc, desc
from contextlib import asynccontextmanager


class SQLAlchemyRepository(AbstractRepository):
    model = None
    search_fields = None
    order_fields = None

    @asynccontextmanager
    async def _session_scope(self):
        async with async_session_maker() as session:
            try:
                yield session
                await session.commit()
            except HTTPException:
                await session.rollback()
                raise
            except Exception as e:
                await session.rollback()
                raise HTTPException(
                    status_code=500,
                    detail=f"Ошибка при выполнении операции: {str(e)}"
                )

    async def get(
            self,
            limit: int,
            offset: int,
            order_by: list[str] | None = None,
            search: str | None = None,
            filters: dict | None = None
    ):
        async with self._session_scope() as session:
            stmt = select(self.model)

            if filters:
                conditions = []
                for field, value in filters.items():
                    if isinstance(value, list):
                        conditions.append(getattr(self.model, field).in_(value))
                    else:
                        conditions.append(getattr(self.model, field) == value)
                stmt = stmt.where(*conditions)

            if search and self.search_fields:
                search_conditions = []
                for field in self.search_fields:
                    search_conditions.append(getattr(self.model, field).ilike(f"%{search}%"))
                stmt = stmt.where(or_(*search_conditions))

            if order_by:
                order_clauses = []
                for field in order_by:
                    if field.startswith('-'):
                        field_name = field[1:]
                        direction = desc
                    else:
                        field_name = field
                        direction = asc

                    if self.order_fields and field_name not in self.order_fields:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Недопустимое поле для сортировки: {field_name}"
                        )

                    order_clauses.append(direction(getattr(self.model, field_name)))

                stmt = stmt.order_by(*order_clauses)

            stmt = stmt.limit(limit).offset(offset)
            result = await session.execute(stmt)
            return result.scalars().all()

    async def get_by_id(self, item_id: int | UUID):
        async with self._session_scope() as session:
            stmt = select(self.model).where(self.model.id == item_id)
            result = await session.execute(stmt)
            item = result.scalars().first()
            if not item:
                raise HTTPException(
                    status_code=404,
                    detail=f"{self.model.__name__} с ID {item_id} не найден"
                )
            return item

    async def add(self, data: dict) -> dict:
        async with self._session_scope() as session:
            obj = self.model(**data)
            session.add(obj)
            await session.commit()
            await session.refresh(obj)
            return obj

    async def update(self, data: dict):
        async with self._session_scope() as session:
            stmt = select(self.model).where(self.model.id == data.get('id'))
            result = await session.execute(stmt)
            obj = result.scalars().first()

            if not obj:
                raise HTTPException(
                    status_code=404,
                    detail=f"{self.model.__name__} с ID {data.get('id')} не найден"
                )

            for key, value in data.items():
                setattr(obj, key, value)

            session.add(obj)
            await session.commit()
            await session.refresh(obj)
            return obj

    async def delete(self, item_id: int | UUID):
        async with self._session_scope() as session:
            obj = await self.get_by_id(item_id)
            await session.delete(obj)
            await session.commit()
