from datetime import date

from sqlalchemy import Date, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


class PriceRecord(Base):
    __tablename__ = "price_records"

    id: Mapped[int] = mapped_column(primary_key=True)

    state_id: Mapped[int] = mapped_column(
        ForeignKey("states.state_id"),
        nullable=False
    )

    crop_id: Mapped[int] = mapped_column(
        ForeignKey("crops.crop_id"),
        nullable=False
    )

    record_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    avg_price: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    state: Mapped["State"] = relationship(
        back_populates="price_records"
    )

    crop: Mapped["Crop"] = relationship(
        back_populates="price_records"
    )




