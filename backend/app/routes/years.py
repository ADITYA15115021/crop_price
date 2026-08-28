from fastapi import APIRouter
from sqlalchemy import distinct, extract, select
from sqlalchemy.orm import Session

from backend.database import engine
from models.price_record import PriceRecord
from app.schemas.year import YearResponse

router = APIRouter()


@router.get("/years", response_model=list[YearResponse])
def get_years():

    statement = (
        select(
            distinct(
                extract("year", PriceRecord.record_date)
            )
        )
        .order_by(
            extract("year", PriceRecord.record_date)
        )
    )

    with Session(engine) as session:
        years = session.execute(statement).all()

        return [
            YearResponse(year=int(row[0]))
            for row in years
        ]