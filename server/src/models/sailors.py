import datetime
from uuid import UUID, uuid4
from src.models.base import MyDeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, text, Date


class SailorBase:
    name: Mapped[str] = mapped_column(String(30), nullable=False, comment="Имя моряка")
    surname: Mapped[str] = mapped_column(String(30), nullable=False, comment="Фамилия моряка")
    patronymic: Mapped[str] = mapped_column(String(30), nullable=False, comment="Отчество моряка")
    birth_date: Mapped[datetime.date] = mapped_column(Date, nullable=False, comment="Дата рождения (ГГГГ-ММ-ДД)")
    death_date: Mapped[datetime.date | None] = mapped_column(Date, nullable=True, comment="Дата смерти (ГГГГ-ММ-ДД), если известна")
    admission: Mapped[int] = mapped_column(nullable=False, comment="Номер набора в школу")
    photo_url: Mapped[str] = mapped_column(String(500), nullable=True, comment="Ссылка на фото моряка")
    biography: Mapped[str | None] = mapped_column(String(10000), nullable=True, comment="Биография")

    @validates('birth_date')
    def validate_birth_date(self, key, value):
        if value and value >= datetime.date.today(): raise ValueError("Дата рождения должна быть в прошлом")
        return value

    @validates('death_date')
    def validate_death_date(self, key, value):
        if value and self.birth_date and value <= self.birth_date: raise ValueError("Дата смерти должна быть после даты рождения")
        return value

    @validates('admission')
    def validate_admission(self, key, value):
        if value < 1 or value > 3: raise ValueError("Номер набора варьируется от 1 до 3 включительно")
        return value


class Sailor(MyDeclarativeBase, SailorBase):
    __tablename__ = 'sailors'

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        index=True,
        comment="Идентификатор биографии"
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        server_default=text("timezone('UTC', CURRENT_TIMESTAMP)"),
        comment="Дата добавления биографии"
    )


