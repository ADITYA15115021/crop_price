from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.database import engine

from backend.models.crops import Crop
from backend.app.schemas.crop import CropResponse

router = APIRouter()


@router.get("/crops", response_model=list[CropResponse])
def get_crops():

    statement = (
        select(Crop)
        .order_by(Crop.name)
    )

    with Session(engine) as session:
        crops = session.scalars(statement).all()

        return crops