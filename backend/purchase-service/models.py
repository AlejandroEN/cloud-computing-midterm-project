from sqlalchemy import Boolean, Column, Integer, String, DateTime, func
from database import Base

class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(String, primary_key=True, index=True)
    buyer_id = Column(String, index=True)
    post_id = Column(String, index=True)
    seller_confirmed_at = Column(String, index=True)
    is_inactive = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime, nullable=True)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(String, primary_key=True, index=True)
    purchase_id = Column(String, index=True)
    content = Column(String, index=True)
    seller_stars_amount = Column(Integer, index=True)
    post_stars_amount = Column(Integer, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime, nullable=True)

