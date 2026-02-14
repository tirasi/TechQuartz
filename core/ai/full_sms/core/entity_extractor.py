def extract_profile(message: str) -> str:
    msg = message.lower()

    if "female" in msg or "woman" in msg or "girl" in msg:
        return "female"
    if "senior" in msg or "old" in msg:
        return "senior"
    if "student" in msg:
        return "student"

    return "general"

def extract_location(message: str) -> str:
    msg = message.lower()

    if "bhubaneswar" in msg:
        return "bhubaneswar"
    if "odisha" in msg:
        return "odisha"

    return "india"