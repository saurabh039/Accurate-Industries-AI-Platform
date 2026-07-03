POSITIVE_WORDS = [

    "urgent",
    "important",
    "interested",
    "quotation",
    "require",
    "need",
    "partnership"

]


NEGATIVE_WORDS = [

    "problem",
    "issue",
    "complaint",
    "delay"

]


def analyze_sentiment(message):

    text = message.lower()

    positive = sum(
        w in text
        for w in POSITIVE_WORDS
    )

    negative = sum(
        w in text
        for w in NEGATIVE_WORDS
    )


    if positive > negative:
        return "Positive 😊"

    if negative > positive:
        return "Negative ⚠️"

    return "Neutral 😐"