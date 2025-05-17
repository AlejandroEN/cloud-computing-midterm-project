from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class ReviewBase(BaseModel):
    purchase_id: int
    buyer_id: int
    seller_id: int
    rating: int
    comment: Optional[str]

class ReviewCreate(BaseModel):
    purchase_id: int
    content: str
    seller_stars_amount: int
    posts_stars_amount: int

class Review(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
