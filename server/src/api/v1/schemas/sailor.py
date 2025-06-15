from pydantic import field_validator, model_validator
from uuid import UUID
from src.api.v1.schemas.base import MyBaseModel
from typing import Optional
from datetime import date




class SailorData(MyBaseModel):
    name: str
    surname: str
    patronymic: str
    birth_day: Optional[int] = None
    birth_month: Optional[int] = None
    birth_year: Optional[int] = None
    death_day: Optional[int] = None
    death_month: Optional[int] = None
    death_year: Optional[int] = None
    admission: int
    photo_url: Optional[str] = None
    biography: Optional[str] = None

    @field_validator(
        'birth_day', 'birth_month', 'birth_year', 'death_day', 'death_month', 'death_year',
        mode='before'
    )
    @classmethod
    def empty_string_to_none(cls, v):
        return v if v not in ("", None) else None

    @field_validator('birth_month', 'death_month')
    @classmethod
    def check_month_range(cls, v):
        if v is not None and (v < 1 or v > 12):
            raise ValueError("Месяц должен быть в диапазоне 1..12")
        return v

    @field_validator('birth_year', 'death_year')
    @classmethod
    def check_year_range(cls, v):
        if v is not None:
            current_year = date.today().year
            if v < 1 or v > current_year:
                raise ValueError(f"Год должен быть в диапазоне 1..{current_year}")
        return v

    @field_validator('birth_day', 'death_day')
    @classmethod
    def check_day_range(cls, v):
        if v is not None and (v < 1 or v > 31):
            raise ValueError("День должен быть в диапазоне 1..31")
        return v

    @model_validator(mode='after')
    def validate_dates_consistency(self) -> 'SailorData':
        today = date.today()

        def build_date(day, month, year):
            if day is not None and month is not None and year is not None:
                try:
                    return date(year, month, day)
                except ValueError:
                    raise ValueError(f"Неверная дата: {day}.{month}.{year}")
            return None

        birth = build_date(self.birth_day, self.birth_month, self.birth_year)
        death = build_date(self.death_day, self.death_month, self.death_year)

        if self.birth_year is not None and self.death_year is not None:
            if self.birth_year > self.death_year:
                raise ValueError("Год рождения не может быть позже года смерти")

        if birth and birth > today:
            raise ValueError("Дата рождения не может быть в будущем")

        if death:
            if death > today:
                raise ValueError("Дата смерти не может быть в будущем")
            if birth and death < birth:
                raise ValueError("Дата смерти не может быть раньше даты рождения")

        return self


class SailorDataIdentified(SailorData):
    id: UUID



