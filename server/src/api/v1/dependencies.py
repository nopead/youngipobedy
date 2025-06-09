from src.services.sailors import SailorService
from src.repository.sqlalchemy.sailors import SailorsRepository

from src.services.feedbacks import FeedbacksService
from src.repository.sqlalchemy.feedbacks import FeedbacksRepository

from src.services.sailor_create_requests import SailorsCreateRequestsService
from src.repository.sqlalchemy.sailor_create_requests import SailorsCreateRequestsRepository

from src.services.email import EmailService
from src.services.photo import PhotoService


def sailor_service_dependency():
    return SailorService(SailorsRepository)


def feedback_service_dependency():
    return FeedbacksService(FeedbacksRepository)


def sailor_create_requests_service_dependency():
    return SailorsCreateRequestsService(SailorsCreateRequestsRepository)


def email_service_dependency():
    return EmailService()


def photo_service_dependency():
    return PhotoService()


