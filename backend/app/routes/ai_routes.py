from fastapi import APIRouter

from app.ai.insights.lead_scoring import (
    calculate_lead_score
)

from app.ai.insights.sentiment import (
    analyze_sentiment
)

from app.ai.insights.forecast import (
    forecast_demand
)

from app.ai.insights.recommendations import (
    generate_recommendations
)

from app.database.connection import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

from app.models.inquiry import Inquiry
from app.models.inquiry_items import InquiryItem
from app.models.product import Product


router = APIRouter()


@router.get("/ai-insights")
def ai_insights(db: Session = Depends(get_db)):

    inquiries_db = db.query(Inquiry).all()

    inquiries = []


    for inquiry in inquiries_db:

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

                    "name": product.name,
                    "quantity": item.quantity

                })


        inquiries.append({

            "name": inquiry.name,
            "email": inquiry.email,
            "message": inquiry.message,
            "products": products

        })


    leads = []


    for inquiry in inquiries:

        leads.append({

            "customer": inquiry["name"],

            "score":
                calculate_lead_score(inquiry),

            "sentiment":
                analyze_sentiment(
                    inquiry["message"]
                )

        })


    top_products = forecast_demand(inquiries)

    recommendations = generate_recommendations(
        top_products
    )


    return {

        "lead_scores": leads,

        "forecast": top_products,

        "recommendations": recommendations

    }