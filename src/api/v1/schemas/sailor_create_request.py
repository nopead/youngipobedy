from pydantic import Field, EmailStr
from src.api.v1.schemas.sailor import SailorFullData
from uuid import UUID
import datetime


class SailorsCreateRequestSet(SailorFullData):
    user_fullname: str = Field(max_length=100)
    user_email: EmailStr = Field(max_length=255)
    additional_information: str = Field(max_length=500)


class SailorsCreateRequestGet(SailorsCreateRequestSet):
    id: UUID
    created_at: datetime.datetime
