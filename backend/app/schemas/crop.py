from pydantic import BaseModel


class CropResponse(BaseModel):
    crop_id: int
    name: str