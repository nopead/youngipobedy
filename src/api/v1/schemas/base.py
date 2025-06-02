from pydantic import BaseModel


class MyBaseModel(BaseModel):
    class Config:
        from_attributes = True
