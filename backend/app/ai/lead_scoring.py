def calculate_lead_score(inquiry):

    score = 0

    # Product interest
    score += len(inquiry["products"]) * 20

    # Long message = higher intent
    if len(inquiry["message"]) > 50:
        score += 20

    # Business email bonus
    if inquiry["email"] and "gmail" not in inquiry["email"]:
        score += 20

    return min(score, 100)