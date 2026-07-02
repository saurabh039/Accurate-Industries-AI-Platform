from sqlalchemy import Column, Integer, ForeignKey
from app.database.connection import Base


class InquiryItem(Base):
    __tablename__ = "inquiry_items"

    id = Column(Integer, primary_key=True, index=True)
    inquiry_id = Column(Integer, ForeignKey("inquiries.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    quantity = Column(Integer, default=1)