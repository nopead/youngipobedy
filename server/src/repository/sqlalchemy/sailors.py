from sqlalchemy import select
from src.models.sailors import Sailor as SailorModel
from src.repository.sqlalchemy.base import SQLAlchemyRepository
from src.database.database import async_session_maker
from fastapi import HTTPException


class SailorsRepository(SQLAlchemyRepository):
    model = SailorModel

