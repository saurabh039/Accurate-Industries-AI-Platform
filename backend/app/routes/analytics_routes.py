from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.models.inquiry import Inquiry
from app.models.inquiry_items import InquiryItem
from app.models.product import Product

from app.analytics.dashboard_metrics import (
    calculate_dashboard_metrics
)

from app.analytics.customer_analytics import (
    analyze_customers
)

from app.analytics.product_analytics import (
    analyze_products
)

from app.analytics.kpi_engine import (
    generate_kpis
)

from app.analytics.data_processor import (
    build_inquiry_dataframe
)

from app.analytics.customer_clustering import (
    cluster_customers
)

from app.analytics.ml_lead_scoring import (
    train_lead_model
)

from app.analytics.demand_forecasting import (
    predict_demand
)

from fastapi.responses import FileResponse

from app.analytics.exports.pdf_report import (
    generate_pdf_report
)

from app.analytics.exports.csv_export import (
    export_csv
)

from app.analytics.recommendations.ml_recommendations import (
    generate_ml_recommendations
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

def build_inquiries(db):

    inquiries_db = db.query(
        Inquiry
    ).all()

    inquiries = []

    for inquiry in inquiries_db:

        items = db.query(
            InquiryItem
        ).filter(

            InquiryItem.inquiry_id
            == inquiry.id

        ).all()

        products = []

        for item in items:

            product = db.query(
                Product
            ).filter(

                Product.id
                == item.product_id

            ).first()

            if product:

                products.append({

                    "name": product.name,
                    "quantity": item.quantity

                })

        inquiries.append({

            "name": inquiry.name,
            "status": inquiry.status,
            "message": inquiry.message,
            "products": products,

            # Add this if your model has it
            "created_at":
                getattr(
                    inquiry,
                    "created_at",
                    None
                )

        })

    return inquiries


@router.get("/dashboard")
def dashboard_analytics(
    db: Session = Depends(get_db)
):

    inquiries = build_inquiries(db)

    metrics = calculate_dashboard_metrics(
        inquiries
    )

    return metrics


@router.get("/customers")
def customer_analytics(
    db: Session = Depends(get_db)
):

    inquiries = build_inquiries(db)

    return analyze_customers(
        inquiries
    )


@router.get("/products")
def product_analytics(
    db: Session = Depends(get_db)
):

    inquiries = build_inquiries(db)

    return analyze_products(
        inquiries
    )


@router.get("/kpis")
def kpi_analytics(
    db: Session = Depends(get_db)
):

    inquiries = build_inquiries(db)

    metrics = calculate_dashboard_metrics(
        inquiries
    )

    customers = analyze_customers(
        inquiries
    )

    products = analyze_products(
        inquiries
    )

    return generate_kpis(
        metrics,
        customers,
        products
    )

@router.get("/segments")
def customer_segments(
    db: Session = Depends(get_db)
):

    df = build_inquiry_dataframe(db)

    return cluster_customers(df)

@router.get("/lead-scores")
def lead_scores(
    db: Session = Depends(get_db)
):

    df = build_inquiry_dataframe(db)

    return train_lead_model(df)

@router.get("/export/pdf")
def export_pdf(
    db: Session = Depends(get_db)
):

    inquiries = build_inquiries(db)

    dashboard = calculate_dashboard_metrics(
        inquiries
    )

    customers = analyze_customers(
        inquiries
    )

    products = analyze_products(
        inquiries
    )

    kpis = generate_kpis(
        dashboard,
        customers,
        products
    )

    df = build_inquiry_dataframe(db)

    forecast = predict_demand(df)

    report = {

        "dashboard": dashboard,

        "customers": customers,

        "products": products,

        "kpis": kpis,

        "forecast": forecast

    }

    path = "uploads/analytics_report.pdf"

    generate_pdf_report(
        report,
        path
    )

    return FileResponse(

        path,

        media_type="application/pdf",

        filename="analytics_report.pdf"

    )


@router.get("/export/csv")
def export_products_csv(
    db: Session = Depends(get_db)
):

    df = build_inquiry_dataframe(db)

    path = "uploads/products.csv"

    export_csv(
        df,
        path
    )

    return FileResponse(

        path,

        media_type="text/csv",

        filename="products.csv"

    )


@router.get("/recommendations")
def recommendations(
    db: Session = Depends(get_db)
):

    df = build_inquiry_dataframe(db)

    forecast = predict_demand(df)

    return generate_ml_recommendations(
        forecast
    )


@router.get("/forecast")
def forecast_analytics(
    db: Session = Depends(get_db)
):

    df = build_inquiry_dataframe(db)

    return predict_demand(df)