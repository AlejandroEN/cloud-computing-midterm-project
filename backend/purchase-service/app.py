from fastapi import FastAPI, HTTPException, Path, Query
from pydantic import BaseModel
import mysql.connector
from datetime import datetime
from typing import Optional

import schemas

app = FastAPI()

# Configuración DB
host_name = "localhost"  # CAMBIAR para producción
port_number = "8008"
user_name = "root"
password_db = "utec"
database_name = "bd_api_python"

# Conexión rápida
def get_db():
    return mysql.connector.connect(
        host=host_name,
        user=user_name,
        password=password_db,
        database=database_name
    )

@app.get("/")
def get_echo_test():
    return {"message": "Echo Test OK"}

# ---------- ENDPOINTS COMPATIBLES -----------

@app.post("/purchases/{post_id}")
def create_purchase(post_id: int, buyer_id: int = Query(...)):
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO purchase (buyer_id, post_id, seller_confirmed_at, is_inactive) VALUES (%s, %s, %s, %s)",
        (buyer_id, post_id, None, False)
    )
    db.commit()
    purchase_id = cursor.lastrowid
    cursor.close()
    db.close()
    return {"message": "Compra creada", "purchase_id": purchase_id}

@app.get("/purchases/{post_id}")
def get_purchases_by_post(post_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM purchase WHERE post_id = %s", (post_id,))
    rows = cursor.fetchall()
    cursor.close()
    db.close()
    return rows

@app.get("/purchases/id/{id}")
def get_purchase_by_id(id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM purchase WHERE id = %s", (id,))
    row = cursor.fetchone()
    cursor.close()
    db.close()
    if not row:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return row

@app.patch("/purchases/{id}")
def confirmar_compra(id: int, confirmar: bool = Query(...)):
    db = get_db()
    cursor = db.cursor()
    fecha = datetime.now() if confirmar else None
    cursor.execute("UPDATE purchase SET seller_confirmed_at = %s WHERE id = %s", (fecha, id))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Estado de confirmación actualizado"}

@app.delete("/purchases/{id}")
def eliminar_compra(id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM purchase WHERE id = %s", (id,))
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Compra eliminada"}

@app.get("/purchases/me")
def obtener_mis_compras(role: str = Query(...), user_id: int = Query(...)):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    if role == "buyer":
        cursor.execute("SELECT * FROM purchase WHERE buyer_id = %s", (user_id,))
    elif role == "seller":
        cursor.execute("SELECT * FROM purchase WHERE post_id IN (SELECT id FROM post WHERE seller_id = %s)", (user_id,))
    else:
        raise HTTPException(status_code=400, detail="Rol inválido")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

@app.get("/reviews/{purchase_id}")
def get_review(purchase_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM review WHERE purchase_id = %s", (purchase_id,))
    row = cursor.fetchone()
    cursor.close()
    db.close()
    return row

@app.post("/reviews/{purchase_id}")
def crear_review(purchase_id: int, user_id: int = Query(...), review: schemas.Review = None):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT buyer_id FROM purchase WHERE id = %s", (purchase_id,))
    compra = cursor.fetchone()
    if not compra:
        raise HTTPException(status_code=404, detail="Compra no existe")
    if compra["buyer_id"] != user_id:
        raise HTTPException(status_code=403, detail="No autorizado")

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO review (purchase_id, content, seller_stars_amount, post_stars_amount) VALUES (%s, %s, %s, %s)",
        (purchase_id, review.content, review.seller_stars_amount, review.post_stars_amount)
    )
    db.commit()
    cursor.close()
    db.close()
    return {"message": "Review creada correctamente"}

@app.get("/reviews/post/{post_id}")
def obtener_reviews(post_id: int):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT r.* FROM review r
        JOIN purchase p ON r.purchase_id = p.id
        WHERE p.post_id = %s
    """, (post_id,))
    resultados = cursor.fetchall()
    cursor.close()
    db.close()
    return resultados

# ---------- Ejecutar con Uvicorn ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010)
