from pydantic import Field, EmailStr

from src.api.v1.schemas.sailor import SailorFullData


class SailorCreateRequest(SailorFullData):
    user_full_name: str = Field(max_length=100)
    user_email: EmailStr = Field(max_length=255)
    additional_information: str = Field(max_length=500)
