from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    nombre: str
    especialidad: str
    dni: str
    telefono: str

class Item2(BaseModel):
    nomc: str
    numc: int

class Review(BaseModel):
    purchase_id: int
    content: Optional[str]
    seller_stars_amount: int
    post_stars_amount: int
