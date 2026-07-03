def generate_recommendations(top_products):

    recommendations = []


    for product, qty in top_products:

        recommendations.append(

            f"Increase stock for {product} ({qty} requests)"

        )


    return recommendations