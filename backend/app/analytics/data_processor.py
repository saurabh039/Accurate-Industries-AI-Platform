import pandas as pd

from app.models.inquiry import Inquiry
from app.models.inquiry_items import InquiryItem
from app.models.product import Product


def build_inquiry_dataframe(db):

    inquiries = db.query(Inquiry).all()

    rows = []

    for inquiry in inquiries:

        items = (
            db.query(InquiryItem)
            .filter(InquiryItem.inquiry_id == inquiry.id)
            .all()
        )

        total_products = 0

        for item in items:

            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if product:

                total_products += item.quantity

                rows.append({

                    "customer": inquiry.name,
                    "status": inquiry.status,
                    "product": product.name,
                    "quantity": item.quantity,

                })

    return pd.DataFrame(rows)