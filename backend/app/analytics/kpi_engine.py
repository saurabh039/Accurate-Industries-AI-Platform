def generate_kpis(
    dashboard_metrics,
    customers,
    products
):

    top_customer = (

        customers[0]["customer"]

        if customers

        else "N/A"
    )

    top_product = (

        products[0]["product"]

        if products

        else "N/A"
    )

    return {

        "completion_rate":
            dashboard_metrics[
                "completion_rate"
            ],

        "repeat_customers":
            dashboard_metrics[
                "repeat_customers"
            ],

        "top_customer":
            top_customer,

        "top_product":
            top_product,

        "avg_products_per_inquiry":
            dashboard_metrics[
                "average_products_per_inquiry"
            ]

    }