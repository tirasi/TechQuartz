def extract_profile(message: str) -> str:
    msg = message.lower()

    if "female" in msg or "woman" in msg or "girl" in msg:
        return "female"
    if "senior" in msg or "old" in msg:
        return "senior"
    if "student" in msg:
        return "student"

    return "general"
