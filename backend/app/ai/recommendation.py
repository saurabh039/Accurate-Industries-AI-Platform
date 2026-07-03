def generate_recommendations(forecast):

    recommendations = []

    for product, count in forecast:

        recommendations.append(
            f"Increase stock for {product} ({count} requests)"
        )

    return recommendations