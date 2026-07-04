import pandas as pd

from sklearn.cluster import KMeans


def cluster_customers(df):

    customer_df = (

        df.groupby("customer")

        .agg(
            total_inquiries=("product", "count"),
            total_quantity=("quantity", "sum")
        )

        .reset_index()

    )


    X = customer_df[
        ["total_inquiries", "total_quantity"]
    ]


    model = KMeans(

        n_clusters=3,
        random_state=42

    )


    customer_df["cluster"] = model.fit_predict(X)


    labels = {

        0: "Premium",
        1: "Regular",
        2: "Potential"

    }


    customer_df["segment"] = (

        customer_df["cluster"]
        .map(labels)

    )


    return customer_df[
        ["customer", "segment"]
    ].to_dict(orient="records")