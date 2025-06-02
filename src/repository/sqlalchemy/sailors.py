from sqlalchemy import select
from src.models.sailors import Sailor as SailorModel
from src.repository.sqlalchemy.base import SQLAlchemyRepository
from src.database.database import async_session_maker
from fastapi import HTTPException


class SailorsRepository(SQLAlchemyRepository):
    model = SailorModel

    async def get_sailors_card_info(self, limit: int = 30, offset: int = 0):
        async with async_session_maker() as session:
            try:
                result = await session.execute(
                    select(
                        self.model.id,
                        self.model.name,
                        self.model.surname,
                        self.model.patronymic,
                        self.model.photo_url
                    ).limit(limit).offset(offset)
                )
                return result.mappings().all()
            except Exception as e:
                await session.rollback()
                raise HTTPException(status_code=500, detail=f"Ошибка при чтении данных: {str(e)}")
