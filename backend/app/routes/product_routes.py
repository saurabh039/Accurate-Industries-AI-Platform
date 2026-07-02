from fastapi import APIRouter, UploadFile, File, Depends, Form
from app.database.connection import SessionLocal
from app.models.product import Product
from app.schemas.product_schema import ProductCreate
from app.models.inquiry_items import InquiryItem
from app.utils.security import get_current_admin
import shutil
import uuid

router = APIRouter()

# =========================
# ADD PRODUCT
# =========================
@router.post("/add-product")
def add_product(
    name: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),        # NEW
    subcategory: str = Form(...),     # NEW
    file: UploadFile = File(...),
    admin=Depends(get_current_admin)
):
    db = SessionLocal()

    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"uploads/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_product = Product(
        name=name,
        description=description,
        image_url=file_path,
        category=category,           # NEW
        subcategory=subcategory      # NEW
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {"message": "Product added successfully"}

# =========================
# GET PRODUCTS
# =========================
@router.get("/products")
def get_products():
    db = SessionLocal()
    products = db.query(Product).all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "image_url": p.image_url,
            "category": p.category,          # NEW
            "subcategory": p.subcategory     # NEW
        }
        for p in products
    ]

# =========================
# UPDATE PRODUCT
# =========================
@router.put("/update-product/{product_id}")
def update_product(product_id: int, product: ProductCreate):
    db = SessionLocal()

    existing_product = db.query(Product).filter(Product.id == product_id).first()

    if not existing_product:
        return {"error": "Product not found"}

    existing_product.name = product.name
    existing_product.description = product.description
    existing_product.image_url = product.image_url

    db.commit()

    return {"message": "Product updated successfully"}

# =========================
# DELETE PRODUCT
# =========================
@router.delete("/delete-product/{product_id}")
def delete_product(product_id: int):
    db = SessionLocal()

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return {"error": "Product not found"}

    # Delete related inquiry items first
    db.query(InquiryItem).filter(
        InquiryItem.product_id == product_id
    ).delete()

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}