from pydantic import BaseModel, EmailStr
from typing import List


class InquiryItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    products: List[InquiryItemCreate]