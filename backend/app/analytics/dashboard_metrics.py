import pandas as pd


def calculate_dashboard_metrics(inquiries):

    if not inquiries:

        return {
            "total_inquiries": 0,
            "completed_inquiries": 0,
            "completion_rate": 0,
            "average_products_per_inquiry": 0,
            "repeat_customers": 0
        }

    df = pd.DataFrame(inquiries)

    total_inquiries = len(df)

    completed_inquiries = len(
        df[df["status"] == "Completed"]
    )

    completion_rate = round(
        (completed_inquiries / total_inquiries) * 100,
        2
    )

    total_products = df["products"].apply(len).sum()

    avg_products = round(
        total_products / total_inquiries,
        2
    )

    repeat_customers = df["name"].value_counts()

    repeat_customers = len(
        repeat_customers[
            repeat_customers > 1
        ]
    )

    return {

        "total_inquiries": total_inquiries,

        "completed_inquiries": completed_inquiries,

        "completion_rate": completion_rate,

        "average_products_per_inquiry":
            avg_products,

        "repeat_customers":
            repeat_customers
    }