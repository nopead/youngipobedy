from src.api.v1.schemas.base import MyBaseModel
from pydantic import EmailStr


class EmailRequest(MyBaseModel):
    receiver_email: EmailStr
    context: dict
    subject: str
    template: str



