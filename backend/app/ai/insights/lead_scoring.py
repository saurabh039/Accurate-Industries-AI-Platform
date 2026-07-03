def calculate_lead_score(inquiry):

    score = 0


    # Product interest

    score += len(inquiry["products"]) * 20


    # Message quality

    if len(inquiry["message"]) > 50:
        score += 25
    elif len(inquiry["message"]) > 20:
        score += 15


    # Corporate email bonus

    if "@gmail.com" not in inquiry["email"]:
        score += 20


    return min(score, 100)