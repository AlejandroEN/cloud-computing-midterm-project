from datetime import datetime
from typing import Optional
from pydantic import BaseModel

# Para creación de Purchase
class PurchaseCreate(BaseModel):
    buyer_id: str
    post_id: str
    seller_confirmed_at: Optional[datetime] = None
    is_inactive: bool = False

# Para lectura (incluye campos generados por la BD)
class PurchaseRead(PurchaseCreate):
    id: str
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    class Config:
        orm_mode = True
