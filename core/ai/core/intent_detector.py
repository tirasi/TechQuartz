def detect_intent(message: str) -> str:
    msg = message.lower().strip()

    print("🔍 Intent detector received:", msg)

    if "job" in msg:
        return "job"

    if "intern" in msg:
        return "internship"

    if "scheme" in msg or "yojana" in msg:
        return "govt_scheme"

    return "unknown"