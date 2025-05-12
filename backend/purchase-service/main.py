from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated
import models
from database import SessionLocal, engine, Base
from sqlalchemy.orm import Session

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

class Purchase(Base):
    id: str
    buyer_id: str
    post_id: str
    seller_confirmed_at: str
    is_inactive: bool
    created_at: str
    updated_at: str
    deleted_at: str | None = None

class Review(Base):
    id: str
    purchase_id: str
    content: str
    seller_stars_amount: int
    post_stars_amount: int
    created_at: str
    updated_at: str
    deleted_at: str | None = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/purchases/", status_code=status.HTTP_201_CREATED)
async def create_purchase(purchase: Purchase, db: db_dependency):  
    db_purchase = models.Purchase(**purchase.dict())
    db.add(db_purchase)
    db.commit()

