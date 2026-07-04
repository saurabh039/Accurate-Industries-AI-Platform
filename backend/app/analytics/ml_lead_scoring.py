import pandas as pd

from sklearn.linear_model import LogisticRegression


def train_lead_model(df):

    if df.empty:
        return []


    customer_df = (

        df.groupby("customer")

        .agg(

            products=("product", "count"),

            total_quantity=("quantity", "sum")

        )

        .reset_index()

    )


    if len(customer_df) < 2:

        return []


    customer_df["high_value"] = (

        customer_df["products"] >= 5

    ).astype(int)


    X = customer_df[
        ["products", "total_quantity"]
    ]

    y = customer_df["high_value"]


    if len(y.unique()) < 2:

        return [

            {
                "message":
                "Need at least two classes to train the model."
            }

        ]

    
    model = LogisticRegression()

    model.fit(X, y)


    predictions = model.predict(X)


    results = []


    for i, row in customer_df.iterrows():

        results.append({

            "customer": row["customer"],

            "products": int(row["products"]),

            "quantity": int(row["total_quantity"]),

            "lead_score": int(predictions[i]),

            "label":

                "Hot Lead 🔥"

                if predictions[i]

                else "Cold Lead ❄️"

        })


    return results