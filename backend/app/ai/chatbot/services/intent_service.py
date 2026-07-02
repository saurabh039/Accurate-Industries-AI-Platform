INTENTS = {

    "GREETING": [
        "hi",
        "hii",
        "hiii",
        "hello",
        "hey",
        "good morning",
        "good evening",
        "good afternoon"
    ],

    "PRODUCTS": [
        "product",
        "products",
        "manufacture",
        "manufacturing",
        "make"
    ],

    "SERVICES": [
        "service",
        "services",
        "work",
        "what do you do"
    ],

    "CNC": [
        "cnc"
    ],

    "VMC": [
        "vmc"
    ],

    "FIXTURES": [
        "fixture",
        "fixtures"
    ],

    "MACHINERY": [
        "machine",
        "machinery",
        "equipment"
    ],

    "QUOTATION": [
        "quote",
        "quotation",
        "pricing",
        "cost"
    ],

    "CONTACT": [
        "contact",
        "phone",
        "email"
    ],

    "CLIENTS": [
        "client",
        "customers"
    ]
}


def classify_intent(message):

    msg = message.lower()

    for intent, keywords in INTENTS.items():

        if any(word in msg for word in keywords):

            return intent

    return "GENERAL"