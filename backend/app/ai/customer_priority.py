def rank_customers(segments, leads):

    lead_scores = {
        x["customer"]: x["score"]
        for x in leads
    }

    priority_list = []

    for customer in segments:

        score = lead_scores.get(
            customer["customer"],
            0
        )

        priority = score

        if customer["segment"] == "Premium Customer":
            priority += 30

        elif customer["segment"] == "Potential Customer":
            priority += 15

        priority_list.append({

            "customer":
                customer["customer"],

            "priority_score":
                priority,

            "segment":
                customer["segment"]

        })

    priority_list.sort(
        key=lambda x: x["priority_score"],
        reverse=True
    )

    return priority_list