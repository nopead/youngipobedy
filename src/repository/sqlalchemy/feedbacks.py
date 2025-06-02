from sqlalchemy.ext.asyncio import AsyncSession
from src.api.v1.schemas.feedback import FeedbackCreate
from src.database.database import async_session_maker
from src.models.feedbacks import Feedback
from fastapi import HTTPException
from base import SQLAlchemyRepository


class FeedbacksRepository(SQLAlchemyRepository):
    model = Feedback
