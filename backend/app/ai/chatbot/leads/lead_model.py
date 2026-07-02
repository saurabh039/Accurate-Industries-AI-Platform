from pydantic import BaseModel


class Lead(BaseModel):

    product: str = ""
    quantity: str = ""
    material: str = ""
    drawings: str = ""
    city: str = ""