from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List

from sqlalchemy.orm import Session

from ...db import get_db
from schemas import Review, ReviewCreate
from crud import (
    get_review_by_purchase,
    get_reviews_by_post,
    create_review,
)
from app.services.purchase_service import get_purchase

router = APIRouter(prefix="/reviews", tags=["reviews"])

# GET /reviews/{purchaseId}
@router.get("/{purchase_id}", response_model=Review)
def get_review_for_purchase(request: Request, purchase_id: int, db: Session = Depends(get_db)):
    own_profile_id = request.state.x_profile_id
    review, error = get_review_by_purchase(db, purchase_id, own_profile_id)
    if error:
        raise error
    return review

# GET /reviews/purchase/{postId}
@router.get("/purchase/{post_id}", response_model=List[Review])
def get_reviews_for_post(post_id: int, db: Session = Depends(get_db)):
    reviews = get_reviews_by_post(db, post_id)
    return reviews
