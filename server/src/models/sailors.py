import datetime
from uuid import UUID, uuid4
from src.models.base import MyDeclarativeBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, text


class SailorBase(MyDeclarativeBase):
    __abstract__ = True

    name: Mapped[str] = mapped_column(String(30), nullable=False, comment="Имя моряка")
    surname: Mapped[str] = mapped_column(String(30), nullable=False, comment="Фамилия моряка")
    patronymic: Mapped[str] = mapped_column(String(30), nullable=False, comment="Отчество моряка")

    birth_day: Mapped[int] = mapped_column(nullable=True, comment="День рождения(опционально)")
    birth_month: Mapped[int] = mapped_column(nullable=True, comment="Месяц рождения(опционально)")
    birth_year: Mapped[int] = mapped_column(nullable=True, comment="Год рождения(опционально)")

    death_day: Mapped[int] = mapped_column(nullable=True, comment="День смерти(опционально)")
    death_month: Mapped[int] = mapped_column(nullable=True, comment="Месяц смерти(опционально)")
    death_year: Mapped[int] = mapped_column(nullable=True, comment="Год смерти(опционально)")

    admission: Mapped[int] = mapped_column(nullable=False, comment="Номер набора в школу")
    photo_url: Mapped[str] = mapped_column(String(500), nullable=False, comment="Ссылка на фото моряка")
    biography: Mapped[str | None] = mapped_column(String(10000), nullable=True, comment="Биография")


class Sailor(SailorBase):
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


