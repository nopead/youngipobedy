from src.api.v1.schemas.base import MyBaseModel
from pydantic import EmailStr
from uuid import UUID


class EmailRequest(MyBaseModel):
    receiver_email: EmailStr
    context: dict
    subject: str
    template: str

