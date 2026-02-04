MAX_SMS_CHARS = 160

def summarize_if_needed(text: str) -> str:
    if len(text) <= MAX_SMS_CHARS:
        return text

    # simple rule-based summarization (hackathon-safe)
    return text[:157] + "..."
