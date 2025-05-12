from fastapi import FastAPI
from controllers.purchase.controller import router as purchase_router
import models
from database import engine, Base

# Crear las tablas al iniciar
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Registrar los controladores
app.include_router(purchase_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
