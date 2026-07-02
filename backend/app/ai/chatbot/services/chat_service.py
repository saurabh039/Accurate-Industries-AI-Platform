import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from app.ai.chatbot.services.intent_service import classify_intent
# from app.ai.chatbot.leads.lead_service import (
#     start_lead,
#     process_lead,
#     lead_sessions
# )
# ==========================================
# LOAD MODEL
# ==========================================

model = SentenceTransformer("all-MiniLM-L6-v2")


# ==========================================
# LOAD FAISS INDEX
# ==========================================

index = faiss.read_index(
    "app/ai/chatbot/vector_store/company.index"
)

with open(
    "app/ai/chatbot/vector_store/chunks.pkl",
    "rb"
) as f:
    chunks = pickle.load(f)


# ==========================================
# RETRIEVE CONTEXT
# ==========================================

def retrieve_context(query, k=2):

    query_embedding = model.encode([query])

    query_embedding = np.array(
        query_embedding,
        dtype="float32"
    )

    distances, indices = index.search(
        query_embedding,
        k
    )

    context = []

    for idx in indices[0]:

        if idx < len(chunks):
            context.append(chunks[idx])

    return "\n\n".join(context)


# ==========================================
# MAIN CHAT FUNCTION
# ==========================================

def get_response(
    message,
    history=None,
    session_id=None
):

    if history is None:
        history = []

    msg = message.lower().strip()
    intent = classify_intent(message)

    # ==========================================
    # LEAD SESSION ACTIVE
    # ==========================================

    # if session_id in lead_sessions:

    #     return process_lead(
    #         session_id,
    #         message
    #     )

    # ==========================================
    # CONVERSATION MEMORY
    # ==========================================

    if history:

        previous_user_messages = [
            item["content"].lower()
            if isinstance(item, dict)
            else item.content.lower()
            for item in history
            if (
                item["role"] == "user"
                if isinstance(item, dict)
                else item.role == "user"
            )
        ]


        # ==========================================
        # FOLLOW-UP: FIXTURES
        # ==========================================

        if any(
            word in msg
            for word in [
                "types",
                "which ones",
                "tell me more",
                "more details"
            ]
        ):

            if any(
                "fixture" in m
                for m in previous_user_messages
            ):

                return """
We offer several fixture types:

• Hydraulic Fixtures
• Pneumatic Fixtures
• Pneumatic Leak Test Fixtures
• Inspection Fixtures
• Jig Fixtures

All fixtures are custom-designed according to customer requirements and quality standards.
"""


        # ==========================================
        # FOLLOW-UP: CNC
        # ==========================================

        if any(
            word in msg
            for word in [
                "more",
                "specifications",
                "capacity"
            ]
        ):

            if any(
                "cnc" in m
                for m in previous_user_messages
            ):

                return """
Our CNC capabilities include:

• CNC Turning
• Precision Shafts
• Automotive Components
• High-volume Production
• Micron-level Accuracy

We specialize in repeatable precision manufacturing for OEM clients.
"""

    # ==========================================
    # GREETINGS
    # ==========================================

    greetings = [
        "hi",
        "hii",
        "hiii",
        "hello",
        "hey",
        "good morning",
        "good evening",
        "good afternoon"
    ]

    if msg in greetings:

        return """
Hello! 👋

Welcome to Accurate Industries.

I can help you with:

• Products
• Fixtures & Gauges
• CNC/VMC Services
• Machinery Details
• Manufacturing Capabilities
• Technical Support
• Quotations & Contact Information

How may I assist you today?
"""


    # ==========================================
    # PRODUCTS
    # ==========================================

    if intent == "PRODUCTS":

        return """
Accurate Industries manufactures:

• Forging Dies
• Press Tools
• Press Components
• Hydraulic Fixtures
• Pneumatic Fixtures
• Inspection Gauges
• Machine Clamps
• Dowel Pins
• Machine Shafts
• CNC Turning Components
• Punching Tools
"""


    # ==========================================
    # SERVICES
    # ==========================================

    if intent == "SERVICES":

        return """
Our manufacturing services include:

• CNC Machining
• VMC Machining
• Fixture Manufacturing
• Die & Mould Manufacturing
• Press Components
• Toolroom Services
• Maintenance Works

We specialize in precision engineering solutions for automotive and industrial manufacturing sectors.
"""


    # ==========================================
    # CNC
    # ==========================================

    if intent == "CNC":

        return """
Our CNC machining capabilities include:

• CNC Turning
• Precision Components
• Machine Shafts
• Automotive Parts
• Custom Manufacturing

We ensure micron-level precision, repeatability, and high-quality production.
"""


    # ==========================================
    # VMC
    # ==========================================

    if intent == "VMC":

        return """
Accurate Industries operates 12 VMC machines.

Our VMC services include:

• Precision Milling
• Fixture Manufacturing
• Die Components
• Automotive Parts
• Industrial Components
"""


    # ==========================================
    # FIXTURES
    # ==========================================

    if intent == "FIXTURES":

        return """
We manufacture various industrial fixtures including:

• Hydraulic Fixtures
• Pneumatic Clamping Fixtures
• Pneumatic Leak Test Fixtures
• Inspection Fixtures
• Jig Fixtures

All fixtures are custom-designed according to customer requirements and quality standards.
"""


    # ==========================================
    # MACHINERY
    # ==========================================

    if intent == "MACHINERY":

        return """
Our manufacturing facility includes:

• 12 VMC Machines
• 6 CNC Turning Machines
• 6 Power Press Machines
• 4 Lathe Machines

Additional equipment:

• MITR Machine
• Double Column Pillar Machine
• Cutting Machines
• Bending Machines
• Grinding Machines
"""


    # ==========================================
    # QUOTATIONS
    # ==========================================

    if intent == "QUOTATION":

        return """
Great! 👋

Please visit our Contact page and submit your requirements.

Our team will prepare a customized quotation for you.
"""

    # ==========================================
    # CONTACT
    # ==========================================

    if intent == "CONTACT":

        return """
You can contact Accurate Industries through the Contact page on our website.

Our team will assist with:

• Product Inquiries
• Technical Discussions
• Quotations
• Custom Manufacturing Requirements
• Support Services
"""
    

    # ==========================================
    # CLIENTS
    # ==========================================

    if intent == "CLIENTS":

        return """
Some of our valued clients include:

• YONA FORGE
• Gauri Forge

We primarily serve:

• Automotive Industries
• Manufacturing Companies
• Industrial Engineering Firms
• Precision Component Manufacturers
"""
    

    # ==========================================
    # FALLBACK TO AI SEARCH
    # ==========================================

    context = retrieve_context(message)

    context = context[:500]

    context = (
        context
        .replace("#", "")
        .replace("---", "")
        .replace("##", "")
        .strip()
    )

    return f"""
Based on our company knowledge:

{context}

If you need more details, feel free to ask a follow-up question.
"""

