import pandas as pd
from datetime import datetime


def analyze_trends(inquiries):

    if not inquiries:
        return {
            "daily": {},
            "monthly": {}
        }

    df = pd.DataFrame(inquiries)

    if "created_at" not in df.columns:

        return {
            "daily": {},
            "monthly": {}
        }

    df["created_at"] = pd.to_datetime(
        df["created_at"]
    )

    daily = (
        df.groupby(
            df["created_at"].dt.date
        )
        .size()
        .to_dict()
    )

    monthly = (
        df.groupby(
            df["created_at"].dt.to_period("M")
        )
        .size()
        .astype(int)
        .to_dict()
    )

    monthly = {
        str(k): v
        for k, v in monthly.items()
    }

    return {

        "daily": daily,
        "monthly": monthly

    }