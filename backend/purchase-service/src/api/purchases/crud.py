from sqlalchemy.orm import Session, Query
from sqlalchemy import func
from typing import Optional
from fastapi import HTTPException, status

from models import Purchase
from schemas import PurchaseCreate, Role
from .schemas import PurchaseGetByPost

from ...utils import validate_profile_id, validate_purchase

async def create_purchase(db: Session, purchase: PurchaseCreate, buyer_id: int, post_id: int) -> Purchase:
    if buyer_id == purchase.seller_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Seller and buyer can't be the same user")

    db_purchase = Purchase(
        post_id=post_id,
        buyer_id=buyer_id,
        seller_id=purchase.seller_id
    )
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)

    return db_purchase

async def get_purchase_by_id(db: Session, purchase_id: int, own_profile_id: int) -> Optional[Purchase]:
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    validate_purchase(purchase)

    validate_profile_id(own_profile_id, [purchase.buyer_id, purchase.seller_id])

    return purchase

async def get_purchases_by_post_id(db: Session, post_id: int, seller: PurchaseGetByPost, own_profile_id: int) -> Query[
    type[Purchase]]:
    seller_id = seller.seller_id
    validate_profile_id(own_profile_id, [seller_id])

    query = db.query(Purchase).filter(Purchase.post_id == post_id, Purchase.seller_id == seller_id)
    return query

async def get_own_purchases(db: Session, own_profile_id: int, role: Role) -> list[type[Purchase]]:
    query = db.query(Purchase)
    if role == "buyer":
        query = query.filter(Purchase.buyer_id == own_profile_id)
    elif role == "seller":
        query = query.filter(Purchase.seller_id == own_profile_id)

    return query.all()

async def update_purchase(db: Session, purchase_id: int, own_profile_id: int) -> Optional[Purchase]:
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    validate_purchase(purchase)

    validate_profile_id(own_profile_id, [purchase.seller_id])

    if purchase.seller_confirmed_at:
        raise HTTPException(status_code=400, detail="Seller has already confirmed the purchase")

    if purchase:
        purchase.seller_confirmed_at = func.now()
        db.commit()
        db.refresh(purchase)
    return purchase

async def delete_purchase(db: Session, purchase_id: int,  own_profile_id: int):
    purchase = db.query(Purchase).filter(Purchase.id == purchase_id).first()
    validate_purchase(purchase)

    validate_profile_id(own_profile_id, [purchase.buyer_id, purchase.seller_id])

    db.delete(purchase)
    db.commit()
