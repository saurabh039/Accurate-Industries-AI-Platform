from collections import Counter


def forecast_demand(inquiries):

    counter = Counter()


    for inquiry in inquiries:

        for product in inquiry["products"]:

            counter[product["name"]] += product["quantity"]


    return counter.most_common(5)