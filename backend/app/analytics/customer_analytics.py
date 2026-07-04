import pandas as pd


def analyze_customers(inquiries):

    if not inquiries:
        return []

    df = pd.DataFrame(inquiries)

    summary = []

    grouped = df.groupby("name")

    for customer, group in grouped:

        total_inquiries = len(group)

        total_products = group[
            "products"
        ].apply(len).sum()

        summary.append({

            "customer": customer,

            "total_inquiries":
                int(total_inquiries),

            "products_requested":
                int(total_products)

        })

    summary.sort(
        key=lambda x: x["total_inquiries"],
        reverse=True
    )

    return summary