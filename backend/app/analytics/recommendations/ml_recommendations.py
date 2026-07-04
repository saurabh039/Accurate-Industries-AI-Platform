def generate_ml_recommendations(forecasts):

    recommendations = []

    for item in forecasts:

        prediction = item[
            "predicted_next_month"
        ]

        if prediction >= 10:

            action = (
                "Increase production capacity"
            )

        elif prediction >= 5:

            action = (
                "Maintain inventory levels"
            )

        else:

            action = (
                "Reduce inventory planning"
            )


        recommendations.append({

            "product":
                item["product"],

            "prediction":
                prediction,

            "recommendation":
                action

        })

    return recommendations