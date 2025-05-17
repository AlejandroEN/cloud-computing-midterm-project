from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    seller = "seller"
    buyer = "buyer"

class PurchaseBase(BaseModel):
    post_id: int
    buyer_id: int
    seller_id: int

class PurchaseCreate(BaseModel):
    seller_id: int

class PurchaseGetByPost(BaseModel):
    seller_id: int

class PurchaseRead(PurchaseCreate):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Purchase(PurchaseBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
