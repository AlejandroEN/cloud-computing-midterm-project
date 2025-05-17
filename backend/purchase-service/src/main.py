from fastapi import FastAPI
from api import purchases, reviews
from db import engine
from api.purchases.models import Base as PurchaseBase
from api.reviews.models import Base as ReviewBase
from api.purchases.routes import router as purchases_router
from api.reviews.routes import router as reviews_router
from middleware import ValidateHeadersMiddleware

app = FastAPI(title="Purchases Microservice")
app.add_middleware(ValidateHeadersMiddleware)

PurchaseBase.metadata.create_all(bind=engine)
ReviewBase.metadata.create_all(bind=engine)

app.include_router(purchases_router)
app.include_router(reviews_router)
