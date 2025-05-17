from fastapi import APIRouter, Depends, status, Request
from typing import List

from sqlalchemy.orm import Session

from .schemas import PurchaseGetByPost
from ...db import get_db
from schemas import Purchase, PurchaseCreate, Role

from src.api.purchases.crud import (
    get_purchase_by_id,
    create_purchase,
    update_purchase,
    delete_purchase, get_own_purchases, get_purchases_by_post_id,
)
router = APIRouter(prefix="/purchases", tags=["purchases"])

# POST /purchases/{postId}
@router.post("/{post_id}", response_model=Purchase)
def create_purchase(request: Request, post_id: int, new_purchase: PurchaseCreate, db: Session = Depends(get_db)):
    buyer_id = request.state.x_profile_id
    purchase, error = create_purchase(db, new_purchase, buyer_id, post_id)
    if error:
        raise error
    return purchase

# GET /purchases/{id}
@router.get("/{purchase_id}", response_model=Purchase)
def get_purchase(request: Request, purchase_id: int, db: Session = Depends(get_db)):
    own_profile_id = request.state.x_profile_id
    purchase, error = get_purchase_by_id(db, purchase_id, own_profile_id)
    if error:
        raise error
    return purchase

# GET /purchases/{post_id}
@router.get("/{post_id}", response_model=List[Purchase])
def get_post_purchases(request: Request, post_id: int, seller: PurchaseGetByPost, db: Session = Depends(get_db)):
    own_profile_id = request.state.x_profile_id
    purchase, error = get_purchases_by_post_id(db, post_id, seller, own_profile_id)
    if error:
        raise error
    return purchase

# GET /purchases/me?role=value
@router.get("/me", response_model=List[Purchase])
def get_my_purchases(request: Request, role: Role, db: Session = Depends(get_db)):
    own_profile_id = request.state.x_profile_id
    purchases, error = get_own_purchases(db, own_profile_id, role)
    if error:
        raise error
    return purchases

# PATCH /purchases/{id}
@router.patch("/{purchase_id}", response_model=Purchase)
def update_purchase_endpoint(request: Request, purchase_id: int, db: Session = Depends(get_db)):
    own_profile_id = request.state.x_profile_id
    purchase, error = update_purchase(db, purchase_id, own_profile_id)
    if error:
        raise error
    return purchase

# DELETE /purchases/{id}
@router.delete("/{purchase_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_purchase_endpoint(request: Request, purchase_id: int, db: Session = Depends(get_db)):
    own_profile_id = request.state.x_profile_id
    deleted, error = delete_purchase(db, purchase_id, own_profile_id)
    if error:
        raise error
    return
