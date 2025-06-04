from src.api.v1.schemas.base import MyBaseModel
from pydantic import EmailStr


class EmailRequest(MyBaseModel):
    receiver_email: EmailStr
    receiver_fullname: str
    subject: str
    template: str
