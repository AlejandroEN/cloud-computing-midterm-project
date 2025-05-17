from sqlalchemy.orm import Session
from models import Review
from ...utils import validate_review, validate_profile_id


async def get_review_by_purchase_id(db: Session, purchase_id: int, own_profile_id: int):
    review = db.query(Review).filter(Review.purchase_id == purchase_id).first()
    validate_review(review)

    validate_profile_id(own_profile_id, [review.buyer_id])

    return review

async def get_reviews_by_post_id(db: Session, post_id: int):
    query = db.query(Review).filter(Review.post_id == post_id)
    return query
