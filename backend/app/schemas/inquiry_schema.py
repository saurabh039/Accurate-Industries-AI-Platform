from pydantic import BaseModel, EmailStr, Field
from typing import List

class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    product_ids: List[int]