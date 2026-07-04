from collections import Counter


def analyze_products(inquiries):

    counter = Counter()

    for inquiry in inquiries:

        for product in inquiry["products"]:

            counter[product["name"]] += product[
                "quantity"
            ]

    return [

        {
            "product": name,
            "requests": count
        }

        for name, count in counter.most_common(10)
    ]