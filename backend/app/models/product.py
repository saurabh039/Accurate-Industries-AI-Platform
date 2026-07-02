from sqlalchemy import Column, Integer, String, Text
from app.database.connection import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(Text)
    image_url = Column(String(1000))
    category = Column(String(100))
    subcategory = Column(String(100))