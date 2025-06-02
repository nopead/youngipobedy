from pydantic import Field, model_validator
from datetime import date
from uuid import UUID
from src.api.v1.schemas.base import MyBaseModel


class SailorShortData(MyBaseModel):
    name: str = Field(..., max_length=30, description="Имя моряка")
    surname: str = Field(..., max_length=30, description="Фамилия моряка")
    patronymic: str = Field(..., max_length=30, description="Отчество моряка")
    photo_url: str | None = Field(None, max_length=500, description="URL главного фото")


class SailorFullData(SailorShortData):
    birth_date: date = Field(None, description="Дата рождения")
    death_date: date | None = Field(None, description="Дата смерти")
    admission: int = Field(..., ge=1, le=3, description="Номер набора в школу")
    biography: str | None = Field(None, max_length=10000, description="Биография в Markdown")

    @classmethod
    def birth_date_in_past(cls, v: date) -> date:
        if v >= date.today():
            raise ValueError("Дата рождения должна быть в прошлом")
        return v

    @model_validator(mode='after')
    def death_date_after_birth(self) -> 'Sailor':
        if self.death_date and self.death_date <= self.birth_date:
            raise ValueError("Дата смерти должна быть после рождения")
        return self


class SailorShortDataIdentified(SailorShortData):
    id: UUID


class SailorFullDataIdentified(SailorFullData):
    id: UUID
