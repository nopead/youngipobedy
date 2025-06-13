from src.models.sailors_create_requests import SailorCreateRequest
from src.repository.sqlalchemy.base import SQLAlchemyRepository
from src.database.database import async_session_maker
from src.models.sailors_create_requests import RequestStatus
from sqlalchemy import select
from fastapi import HTTPException
from uuid import UUID
from src.api.v1.schemas.sailor import SailorData
from typing import Optional


class SailorsCreateRequestsRepository(SQLAlchemyRepository):
    model = SailorCreateRequest
    search_fields = ['name', 'surname', 'patronymic', 'user_fullname', 'user_email']
    order_fields = ['created_at']
    filter_fields = ['status']

    async def get_sailor_data(self, request_id: UUID) -> Optional[SailorData]:
        async with async_session_maker() as session:
            result = await session.execute(
                select(self.model).where(self.model.id == request_id)
            )
            row = result.scalar_one_or_none()
            if row is None:
                return None
            return SailorData.model_validate(row)

    async def approve_request(self, request_id: UUID):
        return await self._update_request_status(request_id, RequestStatus.APPROVED)

    async def reject_request(self, request_id: UUID):
        return await self._update_request_status(request_id, RequestStatus.REJECTED)

    async def _update_request_status(self, request_id: UUID, new_status: RequestStatus):
        async with async_session_maker() as session:
            try:
                result = await session.execute(
                    select(self.model).where(self.model.id == request_id)
                )
                request = result.scalars().first()

                if not request:
                    raise HTTPException(status_code=404, detail=f"Заявка с ID {request_id} не найдена")

                if request.status == RequestStatus.PENDING:
                    request.status = new_status
                    session.add(request)
                    await session.commit()
                    await session.refresh(request)

                    return request

                raise HTTPException(status_code=409, detail="Ошибка при обновлении статуса заявки: невозможно поменять статус")

            except Exception as e:
                await session.rollback()
                raise HTTPException(status_code=500, detail=f"Ошибка при обновлении статуса заявки: {str(e)}")
