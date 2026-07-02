import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from fastapi.staticfiles import StaticFiles

# Import models
from app.models.product import Product
from app.models.inquiry import Inquiry
from app.models.inquiry_items import InquiryItem
from app.models.admin import Admin

# Import routes
from app.routes import product_routes
from app.routes import inquiry_routes
from app.routes import admin_routes

from app.ai.chatbot.routes import chat_routes

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(product_routes.router)
app.include_router(inquiry_routes.router)
app.include_router(admin_routes.router)
app.include_router(chat_routes.router)

@app.get("/")
def home():
    return {"message": "API Running 🚀"}


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app.mount("/uploads", StaticFiles(directory=os.path.join(BASE_DIR, "uploads")), name="uploads")