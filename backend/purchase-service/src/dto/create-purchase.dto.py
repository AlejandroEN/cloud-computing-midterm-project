from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CreatePurchaseDto(BaseModel):
    buyer_id: str  # UUID o identificador del comprador
    post_id: str   # UUID o identificador del post
    seller_confirmed_at: Optional[datetime] = None  # Fecha opcional de confirmación por parte del vendedor
    is_inactive: bool = False  # Campo con valor por defecto en False
    created_at: Optional[datetime] = None  # Fecha de creación, si no se proporciona, será manejada por el backend
    updated_at: Optional[datetime] = None  # Fecha de actualización
    deleted_at: Optional[datetime] = None  # Fecha de eliminación (si aplica)

    class Config:
        orm_mode = True  # Pydantic convertirá los objetos SQLAlchemy a diccionarios de Pydantic
