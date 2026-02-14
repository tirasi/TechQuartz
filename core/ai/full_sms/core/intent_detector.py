def detect_intent(message: str) -> list:
    msg = message.lower()
    intents = []

    # Job related
    if any(word in msg for word in ["job", "naukri", "employment"]):
        intents.append("job")

    # Internship
    if any(word in msg for word in ["intern", "internship", "training"]):
        intents.append("internship")

    # Scholarship / Fellowship
    if any(word in msg for word in ["scholarship", "stipend"]):
        intents.append("scholarship")

    if any(word in msg for word in ["fellowship", "research grant"]):
        intents.append("fellowship")

    # Government / Financial schemes
    if any(word in msg for word in ["scheme", "yojana", "govt scheme"]):
        intents.append("scheme")

    return intents or ["unknown"]
