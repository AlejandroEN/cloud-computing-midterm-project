from fastapi import HTTPException, status

from api.purchases.models import Purchase
from api.reviews.models import Review


def validate_profile_id(header_profile_id: int, other_profile_ids: list):
    if header_profile_id not in other_profile_ids:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail=f"User with ID {header_profile_id} not authorized to perform this action.")

def validate_purchase(purchase: type[Purchase]):
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    if purchase.is_inactive:
        raise HTTPException(status_code=400, detail="Purchase is inactive")

def validate_review(review: type[Review]):
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")