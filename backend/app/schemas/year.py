from pydantic import BaseModel


class YearResponse(BaseModel):
    year: int