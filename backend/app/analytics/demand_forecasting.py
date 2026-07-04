from sklearn.linear_model import LinearRegression


def predict_demand(df):

    if df.empty:

        return []

    product_summary = (

        df.groupby("product")
        ["quantity"]
        .sum()
        .reset_index()

    )

    results = []

    for _, row in product_summary.iterrows():

        current = int(row["quantity"])

        # Fake historical trend
        X = [[1], [2], [3]]

        y = [

            max(1, current - 2),
            max(1, current - 1),
            current

        ]

        model = LinearRegression()

        model.fit(X, y)

        prediction = int(

            model.predict([[4]])[0]

        )

        results.append({

            "product": row["product"],

            "current_demand": current,

            "predicted_next_month": prediction,

            "trend":

                "Growing 📈"
                if prediction > current
                else "Stable ➖"

        })

    return sorted(

        results,

        key=lambda x:
        x["predicted_next_month"],

        reverse=True

    )