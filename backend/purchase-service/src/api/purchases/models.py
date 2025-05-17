from sqlalchemy import Column, Boolean, DateTime, func, Integer
from uuid import uuid4
from src.db import Base

class Purchase(Base):
    __tablename__ = "purchases"

    id                  = Column(Integer, primary_key=True, default=uuid4, index=True)
    buyer_id            = Column(Integer, nullable=False, index=True)
    post_id             = Column(Integer, nullable=False, index=True)
    seller_id           = Column(Integer, nullable=False, index=True)
    seller_confirmed_at = Column(DateTime, nullable=True, index=True)
    is_inactive         = Column(Boolean, default=False)
    created_at          = Column(DateTime, default=func.now())
    updated_at          = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at          = Column(DateTime, nullable=True)
