from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, get_db
from app.models.inquiry import Inquiry
from app.models.inquiry_items import InquiryItem
from app.schemas.inquiry_schema import InquiryCreate
from app.models.product import Product
from fastapi import HTTPException


router = APIRouter()

# ================= SUBMIT INQUIRY =================
@router.post("/submit-inquiry")
def submit_inquiry(data: InquiryCreate, db: Session = Depends(get_db)):
    
    new_inquiry = Inquiry(
        name=data.name,
        email=data.email,
        phone=data.phone,
        message=data.message
    )

    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)

    # Save selected products
    for product_id in data.product_ids:
        item = InquiryItem(
            inquiry_id=new_inquiry.id,
            product_id=product_id
        )
        db.add(item)

    db.commit()

    return {"message": "Inquiry submitted successfully 🚀"}


# ================= GET INQUIRIES =================
@router.get("/inquiries")
def get_inquiries(db: Session = Depends(get_db)):

    inquiries = db.query(Inquiry).all()
    result = []

    for inquiry in inquiries:
        items = db.query(InquiryItem).filter(
            InquiryItem.inquiry_id == inquiry.id
        ).all()

        products = []

        for item in items:
            product = db.query(Product).filter(
                Product.id == item.product_id
            ).first()

            if product:
                products.append({
                    "id": product.id,
                    "name": product.name
                })

        result.append({
            "id": inquiry.id,
            "name": inquiry.name,
            "email": inquiry.email,
            "phone": inquiry.phone,
            "message": inquiry.message,
            "status": inquiry.status,
            "products": products
        })

    return result

@router.delete("/delete-inquiry/{inquiry_id}")
def delete_inquiry(inquiry_id: int, db: Session = Depends(get_db)):

    # delete related items first
    db.query(InquiryItem).filter(
        InquiryItem.inquiry_id == inquiry_id
    ).delete()

    # delete inquiry
    inquiry = db.query(Inquiry).filter(
        Inquiry.id == inquiry_id
    ).first()

    if not inquiry:
        return {"error": "Inquiry not found"}

    db.delete(inquiry)
    db.commit()

    return {"message": "Inquiry deleted successfully"}

# ================= UPDATE STATUS =================
@router.put("/update-inquiry-status/{inquiry_id}")
def update_inquiry_status(inquiry_id: int, status: str, db: Session = Depends(get_db)):

    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()

    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    inquiry.status = status
    db.commit()

    return {"message": "Status updated successfully"}