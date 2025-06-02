from sqlalchemy.ext.asyncio import AsyncSession
from src.api.v1.schemas.sailor_create_request import SailorCreateRequest as SCRSchema
from src.models.sailors_create_requests import SailorCreateRequest as SCRModel
from fastapi import HTTPException


async def add_sailor_create_request(
        data: SCRSchema,
        session: AsyncSession
):
    try:
        request = SCRModel(**data.model_dump())

        session.add(request)
        await session.commit()
        await session.refresh(request)

        return request

    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании заявки на добавление моряка: {str(e)}"
        )
