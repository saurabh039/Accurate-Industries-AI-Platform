from fastapi import APIRouter

from app.ai.lead_scoring import (
    calculate_lead_score
)

from app.ai.insights.sentiment import (
    analyze_sentiment
)

from app.ai.forecasting import (
    forecast_demand
)

from app.ai.recommendation import (
    generate_recommendations
)

from fastapi.responses import FileResponse

from app.database.connection import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

from app.models.inquiry import Inquiry
from app.models.inquiry_items import InquiryItem
from app.models.product import Product

from app.ai.report_generator import (
    generate_ai_report
)

from app.ai.analytics_visualizer import (
    generate_demand_chart,
    generate_segment_chart,
    generate_lead_chart
)

from app.ai.customer_segmentation import (
    segment_customers
)

from app.ai.customer_priority import (
    rank_customers
)

from pydantic import BaseModel

from app.ai.chatbot.company_bot import (
    answer_question
)

class ChatRequest(BaseModel):

    question: str

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
            "status": inquiry.status,
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

    customer_segments = segment_customers(inquiries)

    customer_priority = rank_customers(
        customer_segments,
        leads
    )
    
    return {

        "lead_scores": leads,

        "forecast": top_products,

        "recommendations": recommendations,

        "customer_segments": customer_segments,

        "customer_priority": customer_priority

    }

@router.get("/generate-report")
def generate_report(db: Session = Depends(get_db)):

    insights = ai_insights(db)

    path = "uploads/reports/ai_report.pdf"

    generate_ai_report(
        insights,
        path
    )

    return FileResponse(
        path,
        media_type="application/pdf",
        filename="Accurate_AI_Report.pdf"
    )

@router.get("/generate-demand-chart")
def demand_chart(db: Session = Depends(get_db)):

    insights = ai_insights(db)

    path = "uploads/charts/demand.png"

    generate_demand_chart(
        insights["forecast"],
        path
    )

    return FileResponse(path)

@router.get("/generate-segment-chart")
def segment_chart(db: Session = Depends(get_db)):

    insights = ai_insights(db)

    path = "uploads/charts/segments.png"

    generate_segment_chart(
        insights["customer_segments"],
        path
    )

    return FileResponse(path)

@router.get("/generate-lead-chart")
def lead_chart(db: Session = Depends(get_db)):

    insights = ai_insights(db)

    path = "uploads/charts/leads.png"

    generate_lead_chart(
        insights["lead_scores"],
        path
    )

    return FileResponse(path)

@router.post("/chatbot")
def chatbot(

    data: ChatRequest,
    db: Session = Depends(get_db)

):

    response = answer_question(
        data.question,
        db
    )

    return {

        "question": data.question,

        "answer": response

    }