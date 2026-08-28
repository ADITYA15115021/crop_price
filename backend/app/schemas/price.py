from datetime import date
from pydantic import BaseModel


class PriceResponse(BaseModel):
    state: str
    crop: str
    record_date: date
    avg_price: float | None

class PriceSummary(BaseModel):
    count: int
    average_price: float | None
    minimum_price: float | None
    maximum_price: float | None

class StatePriceSummary(BaseModel):
    state: str
    count: int
    average_price: float | None
    minimum_price: float | None
    maximum_price: float | None

class PriceTrend(BaseModel):
    state: str
    crop: str
    date: date
    price: float | None


class StateCropPriceSummary(BaseModel):
    state: str
    crop: str
    count: int
    average_price: float | None
    minimum_price: float | None
    maximum_price: float | None

# class PriceResponse(BaseModel):
#     state_id: int
#     crop_id: int
#     record_date: date
#     avg_price: float | None