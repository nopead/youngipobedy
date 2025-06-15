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
    filter_fields = None

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

    def _apply_filters(self, stmt, filters: dict | None):
        if not filters:
            return stmt

        conditions = []
        for field, value in filters.items():
            column = getattr(self.model, field, None)
            if column is None:
                continue
            if isinstance(value, list):
                conditions.append(column.in_(value))
            else:
                conditions.append(column == value)

        return stmt.where(*conditions)

    def _apply_search(self, stmt, search: str | None):
        if not search or not self.search_fields:
            return stmt

        search_conditions = [
            getattr(self.model, field).ilike(f"%{search}%")
            for field in self.search_fields
            if hasattr(self.model, field)
        ]
        return stmt.where(or_(*search_conditions))

    def _apply_ordering(self, stmt, order_by: list[str] | None):
        if not order_by:
            return stmt

        order_clauses = []
        for field in order_by:
            direction = desc if field.startswith('-') else asc
            field_name = field.lstrip('-')

            if self.order_fields and field_name not in self.order_fields:
                raise HTTPException(status_code=400, detail=f"Недопустимое поле для сортировки: {field_name}")

            column = getattr(self.model, field_name, None)
            if column is None:
                raise HTTPException(status_code=400, detail=f"Поле не найдено в модели: {field_name}")

            order_clauses.append(direction(column))

        return stmt.order_by(*order_clauses)

    async def get(self,limit: int,offset: int,order_by: list[str] | None = None,search: str | None = None, filters: dict | None = None):
        async with self._session_scope() as session:
            stmt = select(self.model)

            stmt = self._apply_filters(stmt, filters)
            stmt = self._apply_search(stmt, search)
            stmt = self._apply_ordering(stmt, order_by)

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

    async def update(self, item_id: int | UUID, data: dict):
        async with self._session_scope() as session:
            stmt = select(self.model).where(self.model.id == item_id)
            result = await session.execute(stmt)
            obj = result.scalars().first()

            if not obj:
                raise HTTPException(status_code=404, detail=f"{self.model.__name__} с ID {item_id} не найден")

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
