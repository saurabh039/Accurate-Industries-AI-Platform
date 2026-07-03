from datetime import datetime

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak
)

from reportlab.lib.styles import getSampleStyleSheet


def generate_ai_report(data, filepath):

    doc = SimpleDocTemplate(filepath)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "Accurate Industries AI Report",
            styles["Title"]
        )
    )

    elements.append(
        Paragraph(
            f"Generated: {datetime.now()}",
            styles["Normal"]
        )
    )

    elements.append(Spacer(1, 20))


    elements.append(
        Paragraph(
            "Lead Scores",
            styles["Heading2"]
        )
    )

    for lead in data["lead_scores"]:

        elements.append(

            Paragraph(

                f'{lead["customer"]}: '
                f'{lead["score"]} '
                f'({lead["sentiment"]})',

                styles["Normal"]

            )

        )


    elements.append(Spacer(1, 20))


    elements.append(
        Paragraph(
            "Demand Forecast",
            styles["Heading2"]
        )
    )

    for product, count in data["forecast"]:

        elements.append(

            Paragraph(

                f"{product}: {count} requests",

                styles["Normal"]

            )

        )


    elements.append(Spacer(1, 20))


    elements.append(
        Paragraph(
            "Customer Segments",
            styles["Heading2"]
        )
    )

    for customer in data["customer_segments"]:

        elements.append(

            Paragraph(

                f'{customer["customer"]} → '
                f'{customer["segment"]}',

                styles["Normal"]

            )

        )


    elements.append(Spacer(1, 20))


    elements.append(
        Paragraph(
            "AI Recommendations",
            styles["Heading2"]
        )
    )

    for recommendation in data["recommendations"]:

        elements.append(

            Paragraph(

                recommendation,

                styles["Normal"]

            )

        )


    doc.build(elements)