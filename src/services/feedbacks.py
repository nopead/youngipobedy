from src.repository.base import AbstractRepository
from src.api.v1.schemas.feedback import FeedbackIdentified, Feedback
from typing import List, Optional
from src.services.core import parse_filters


class FeedbacksService:
    def __init__(self, feedback_repo: AbstractRepository):
        self.feedback_repo: AbstractRepository = feedback_repo()

    async def get_feedbacks(self,
                            limit: int,
                            offset: int,
                            order_by: Optional[List[str]],
                            search: Optional[str],
                            filters: Optional[str]
                            ) -> List[FeedbackIdentified]:
        return await self.feedback_repo.get(limit, offset, order_by, search, filters=parse_filters(filters))

    async def add_feedback(self, feedback: Feedback) -> FeedbackIdentified:
        data = feedback.model_dump()
        result = await self.feedback_repo.add(data)
        return FeedbackIdentified.model_validate(result)

    async def delete_feedback(self, feedback_id: int):
        return await self.feedback_repo.delete(feedback_id)
