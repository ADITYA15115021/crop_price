from datetime import date

from models.state import State
from models.crops import Crop

from fastapi import APIRouter, Query
from sqlalchemy import select, extract, func
from sqlalchemy.orm import Session


from backend.database import engine
from models.price_record import PriceRecord
from app.schemas.price import PriceResponse, PriceSummary,StatePriceSummary,PriceTrend
from app.schemas.price import StateCropPriceSummary

router = APIRouter()

from fastapi import APIRouter, Query
from sqlalchemy import extract, select
from sqlalchemy.orm import Session

from backend.database import engine
from models.price_record import PriceRecord
from app.schemas.price import PriceResponse



@router.get("/prices", response_model=list[PriceResponse])
def get_prices(
    state_ids: list[int] | None = Query(default=None),
    crop_ids: list[int] | None = Query(default=None),
    years: list[int] | None = Query(default=None),

    # pagination
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
):

    statement = (
        select(PriceRecord)
        .join(PriceRecord.state)
        .join(PriceRecord.crop)
    )

    # filters
    if state_ids:
        statement = statement.where(
            PriceRecord.state_id.in_(state_ids)
        )

    if crop_ids:
        statement = statement.where(
            PriceRecord.crop_id.in_(crop_ids)
        )

    if years:
        statement = statement.where(
            extract("year", PriceRecord.record_date).in_(years)
        )

    # pagination
    statement = statement.limit(limit).offset(offset)

    with Session(engine) as session:
        records = session.scalars(statement).all()

        return [
            PriceResponse(
                state=record.state.name,
                crop=record.crop.name,
                record_date=record.record_date,
                avg_price=float(record.avg_price)
                if record.avg_price is not None
                else None
            )
            for record in records
        ]


    # if years:
    #     statement = statement.where(
    #         PriceRecord.record_date >= date(min(years), 1, 1),
    #         PriceRecord.record_date <= date(max(years), 12, 31)
    #     )


@router.get("/prices/summary")
def get_price_summary(
    state_ids: list[int] | None = Query(default=None),
    crop_ids: list[int] | None = Query(default=None),
    years: list[int] | None = Query(default=None),
):
    statement = (
        select(
            State.name,
            Crop.name,
            func.count(PriceRecord.id),
            func.avg(PriceRecord.avg_price),
            func.min(PriceRecord.avg_price),
            func.max(PriceRecord.avg_price),
        )
        .join(PriceRecord.state)
        .join(PriceRecord.crop)
        .group_by(
            State.name,
            Crop.name
        )
        .order_by(
            State.name,
            Crop.name
        )
    )

    if state_ids:
        statement = statement.where(
            PriceRecord.state_id.in_(state_ids)
        )

    if crop_ids:
        statement = statement.where(
            PriceRecord.crop_id.in_(crop_ids)
        )

    if years:
        statement = statement.where(
            extract("year", PriceRecord.record_date).in_(years)
        )

    with Session(engine) as session:
        results = session.execute(statement).all()

        return [
            StateCropPriceSummary(
                state=row[0],
                crop=row[1],
                count=row[2],
                average_price=float(row[3])
                if row[3] is not None else None,
                minimum_price=float(row[4])
                if row[4] is not None else None,
                maximum_price=float(row[5])
                if row[5] is not None else None,
            )
            for row in results
        ]



@router.get("/prices/trends", response_model=list[PriceTrend])
def get_price_trends(
    state_ids: list[int] | None = Query(default=None),
    crop_ids: list[int] | None = Query(default=None),
    years: list[int] | None = Query(default=None),
):
    statement = (
        select(
            State.name,
            Crop.name,
            PriceRecord.record_date,
            PriceRecord.avg_price,
        )
        .join(PriceRecord.state)
        .join(PriceRecord.crop)
        .order_by(
            State.name,
            Crop.name,
            PriceRecord.record_date,
        )
    )

    if state_ids:
        statement = statement.where(
            PriceRecord.state_id.in_(state_ids)
        )

    if crop_ids:
        statement = statement.where(
            PriceRecord.crop_id.in_(crop_ids)
        )

    if years:
        statement = statement.where(
            extract("year", PriceRecord.record_date).in_(years)
        )

    with Session(engine) as session:
        results = session.execute(statement).all()

        return [
            PriceTrend(
                state=row[0],
                crop=row[1],
                date=row[2],
                price=float(row[3])
                if row[3] is not None
                else None,
            )
            for row in results
        ]