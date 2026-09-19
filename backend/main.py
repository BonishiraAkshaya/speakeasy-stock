from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from models import Product, Transaction
from routes.products import router as products_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="SpeakEasy Stock API",
    description="Voice-First Inventory Management for Small Businesses",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(products_router)


@app.get("/")
def home():
    return {
        "message": "SpeakEasy Stock API is running"
    }