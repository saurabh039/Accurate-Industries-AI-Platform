from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str
    image_url: str