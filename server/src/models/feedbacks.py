import datetime

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import BigInteger, String, text

from src.models.base import MyDeclarativeBase


class Feedback(MyDeclarativeBase):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(100), nullable=False, comment="ФИО отправителя")
    email: Mapped[str | None] = mapped_column(String(255), nullable=False, comment="Почта отправителя")
    message: Mapped[str] = mapped_column(String(5000), nullable=False)
    additional_information: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="Дополнительные сведения от пользователя, например для связи(телефон, telegram, vk и т.д.)")
    created_at: Mapped[datetime.datetime] = mapped_column(server_default=text("timezone('UTC', CURRENT_TIMESTAMP)"), comment="Дата создания обращения")
