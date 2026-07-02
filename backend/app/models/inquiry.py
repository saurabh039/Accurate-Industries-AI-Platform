from sqlalchemy import Column, Integer, String, Text
from app.database.connection import Base

class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    message = Column(Text)

    status = Column(String(50), default="Pending") 