import datetime
from enum import Enum
from uuid import UUID, uuid4
from typing import Optional
from src.models.base import MyDeclarativeBase
from src.models.sailors import SailorBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, text, Enum as SQLEnum


class RequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class SailorCreateRequest(SailorBase):
    __tablename__ = 'sailor_create_requests'

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, index=True, comment="Идентификатор заявки")
    user_fullname: Mapped[str] = mapped_column(String(100), nullable=False, comment="ФИО пользователя, подавшего заявку")
    user_email: Mapped[str] = mapped_column(String(255), nullable=False, comment="Email пользователя")
    additional_information: Mapped[str | None] = mapped_column(String(500), nullable=True, comment="Дополнительные сведения от пользователя, например для связи(телефон, telegram, vk и т.д.)")
    status: Mapped[RequestStatus] = mapped_column(SQLEnum(RequestStatus), default=RequestStatus.PENDING, nullable=False, comment="Статус заявки")
    created_at: Mapped[datetime.datetime] = mapped_column(nullable=False, server_default=text("timezone('UTC', CURRENT_TIMESTAMP)"), comment="Дата создания заявки")




