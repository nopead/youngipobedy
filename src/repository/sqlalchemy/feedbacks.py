from src.models.feedbacks import Feedback
from src.repository.sqlalchemy.base import SQLAlchemyRepository


class FeedbacksRepository(SQLAlchemyRepository):
    model = Feedback
