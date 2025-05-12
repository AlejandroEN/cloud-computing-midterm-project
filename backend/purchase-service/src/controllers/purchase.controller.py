from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas
from services.purchase.service import create_purchase, get_purchase_with_contact
from database import SessionLocal

router = APIRouter()

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post(
    "/purchases/{post_id}",
    response_model=schemas.PurchaseWithContactDTO,
    status_code=status.HTTP_201_CREATED
)
def create_purchase_for_post(
    post_id: str,
    purchase: schemas.CreatePurchaseDto,  # Usamos el DTO para la creación
    db: Session = Depends(get_db)
):
    # Llamada al servicio para crear la compra
    db_purchase = create_purchase(db, purchase, post_id)

    # Llamada al servicio para obtener la compra con los datos de contacto
    purchase_with_contact = get_purchase_with_contact(db, db_purchase.id)
    
    if not purchase_with_contact:
        raise HTTPException(status_code=404, detail="Purchase not found")
    
    return purchase_with_contact
