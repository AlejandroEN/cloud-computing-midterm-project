from sqlalchemy.orm import Session
import models
import schemas
from datetime import datetime
from . import create_purchase_dto

# Función para crear la compra en la base de datos
def create_purchase(db: Session, purchase_dto: create_purchase_dto.CreatePurchaseDto, post_id: str) -> models.Purchase:
    # Creación de la compra
    db_purchase = models.Purchase(
        buyer_id=purchase_dto.buyer_id,
        post_id=post_id,
        seller_confirmed_at=purchase_dto.seller_confirmed_at,
        is_inactive=purchase_dto.is_inactive,
        created_at=purchase_dto.created_at or datetime.utcnow(),
        updated_at=purchase_dto.updated_at or datetime.utcnow(),
        deleted_at=purchase_dto.deleted_at
    )
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)

    # Lógica para el evento
    # Enviar un evento de compra creada (esto depende de tu infraestructura)
    # create_event("purchase_created", {"purchase_id": db_purchase.id})

    return db_purchase

# Función para obtener la compra con los datos de contacto
def get_purchase_with_contact(db: Session, purchase_id: str) -> schemas.PurchaseWithContactDTO:
    db_purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()
    if not db_purchase:
        return None

    # Obtener los datos de contacto del comprador (esto se simula aquí)
    contact_info = {"email": "user@example.com", "phone": "987654321"}

    # Crear y devolver el DTO con los datos de la compra y el contacto
    purchase_with_contact = schemas.PurchaseWithContactDTO.from_orm(db_purchase)
    purchase_with_contact.contact_info = contact_info
    return purchase_with_contact
