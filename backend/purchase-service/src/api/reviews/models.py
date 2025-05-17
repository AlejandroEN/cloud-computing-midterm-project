from sqlalchemy import Column, DateTime, func, Integer, String
from uuid import uuid4
from src.db import Base

class Review(Base):
    __tablename__ = "reviews"

    id                  = Column(Integer, primary_key=True, default=uuid4, index=True)
    purchase_id         = Column(Integer, nullable=False, index=True)
    post_id             = Column(Integer, nullable=False, index=True)
    buyer_id            = Column(Integer, nullable=False, index=True)
    content             = Column(String(200), index=True)
    seller_stars_amount = Column(Integer, index=True)
    post_stars_amount   = Column(Integer, index=True)
    created_at          = Column(DateTime, default=func.now())
    updated_at          = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at          = Column(DateTime, nullable=True)
