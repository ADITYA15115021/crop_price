from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.database import engine
from models.state import State
from app.schemas.state import StateResponse

router = APIRouter()


@router.get("/states", response_model=list[StateResponse])
def get_states():

    statement = (
        select(State)
        .order_by(State.name)
    )

    with Session(engine) as session:
        states = session.scalars(statement).all()

        return states