from collections import Counter


def forecast_demand(inquiries):

    products = []

    for inquiry in inquiries:

        for product in inquiry["products"]:

            products.append(product["name"])

    counter = Counter(products)

    return counter.most_common(5)