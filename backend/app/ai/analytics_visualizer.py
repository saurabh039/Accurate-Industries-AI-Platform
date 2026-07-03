import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt

from collections import Counter

def generate_demand_chart(forecast, path):

    products = [x[0] for x in forecast]
    counts = [x[1] for x in forecast]

    plt.figure(figsize=(10, 6))

    plt.bar(products, counts)

    plt.title("Product Demand Forecast")

    plt.xlabel("Products")

    plt.ylabel("Requests")

    plt.xticks(rotation=20)

    plt.tight_layout()

    plt.savefig(path)

    plt.close()

def generate_segment_chart(segments, path):

    labels = [
        s["segment"]
        for s in segments
    ]

    counts = Counter(labels)

    plt.figure(figsize=(8, 8))

    plt.pie(
        counts.values(),
        labels=counts.keys(),
        autopct="%1.1f%%"
    )

    plt.title("Customer Segmentation")

    plt.savefig(path)

    plt.close()

def generate_lead_chart(leads, path):

    scores = [
        x["score"]
        for x in leads
    ]

    plt.figure(figsize=(8, 5))

    plt.hist(scores, bins=5)

    plt.title("Lead Score Distribution")

    plt.xlabel("Score")

    plt.ylabel("Customers")

    plt.savefig(path)

    plt.close()