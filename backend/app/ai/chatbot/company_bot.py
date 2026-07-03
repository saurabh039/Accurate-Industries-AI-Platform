from app.models.product import Product


def answer_question(question, db):

    q = question.lower()

    # Products
    if "product" in q or "machine" in q:

        products = db.query(Product).all()

        names = [
            p.name
            for p in products[:10]
        ]

        return (
            "Accurate Industries manufactures:\n\n"
            + "\n".join(names)
        )

    # Company
    if "accurate" in q or "company" in q:

        return (
            "Accurate Industries specializes in precision "
            "machining, fixtures, gauges, dies and industrial "
            "manufacturing solutions."
        )

    # AI
    if "ai" in q:

        return (
            "The AI platform provides demand forecasting, "
            "customer segmentation, lead scoring and "
            "recommendation systems."
        )

    # Default
    return (
        "I can answer questions about products, "
        "manufacturing capabilities and AI insights."
    )