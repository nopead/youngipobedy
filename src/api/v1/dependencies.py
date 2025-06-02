from src.repository.sqlalchemy.sailors import SailorsRepository
from src.services.sailors import SailorService

from src.services.feedbacks import FeedbacksService
from src.repository.sqlalchemy.feedbacks import FeedbacksRepository

from typing import Annotated
from fastapi import Depends
from src.auth.auth import admin_auth



admin_dependency = Annotated[str, Depends(admin_auth)]


def sailor_service_dependency():
    return SailorService(SailorsRepository)


def feedback_service_dependency():
    return FeedbacksService(FeedbacksRepository)