from src.api.v1.schemas.base import MyBaseModel
from pydantic import EmailStr, Field


class Feedback(MyBaseModel):
    full_name: str = Field(max_length=100)
    email: EmailStr = Field(max_length=255)
    message: str = Field(max_length=5000)
    additional_information: str = Field(max_length=500)


class FeedbackIdentified(Feedback):
    id: int
