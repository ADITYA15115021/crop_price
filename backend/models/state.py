from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database import Base


class State(Base):
    __tablename__ = "states"

    state_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    price_records: Mapped[list["PriceRecord"]] = relationship(
        back_populates="state"
    )



