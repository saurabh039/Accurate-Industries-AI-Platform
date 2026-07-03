from collections import defaultdict

def segment_customers(inquiries):

    customers = defaultdict(
        lambda: {
            "products_requested": 0,
            "total_inquiries": 0
        }
    )

    for inquiry in inquiries:

        name = inquiry["name"]

        customers[name]["total_inquiries"] += 1
        customers[name]["products_requested"] += len(
            inquiry["products"]
        )

    segments = []

    for customer, data in customers.items():

        total_products = data["products_requested"]
        total_inquiries = data["total_inquiries"]

        if total_products >= 4:
            segment = "Premium Customer"

        elif total_inquiries >= 3:
            segment = "Potential Customer"

        else:
            segment = "Low Value"

        segments.append({
            "customer": customer,
            "products_requested": total_products,
            "total_inquiries": total_inquiries,
            "segment": segment
        })

    return segments

