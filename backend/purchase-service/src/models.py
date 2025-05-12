from sqlalchemy import Boolean, Column, Integer, String, DateTime, func
from database import Base

class Purchase(Base):
    __tablename__ = "purchases"

    id                  = Column(String(100), primary_key=True, index=True)
    buyer_id            = Column(String(100), nullable=False, index=True)
    post_id             = Column(String(100), nullable=False, index=True)
    seller_confirmed_at = Column(DateTime, nullable=True, index=True)
    is_inactive         = Column(Boolean, default=False)
    created_at          = Column(DateTime, default=func.now())
    updated_at          = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at          = Column(DateTime, nullable=True)

class Review(Base):
    __tablename__ = "reviews"

    id                  = Column(String(100), primary_key=True, index=True)
    purchase_id         = Column(String(100), nullable=False, index=True)
    content             = Column(String(100), index=True)
    seller_stars_amount = Column(Integer, index=True)
    post_stars_amount   = Column(Integer, index=True)
    created_at          = Column(DateTime, default=func.now())
    updated_at          = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at          = Column(DateTime, nullable=True)
