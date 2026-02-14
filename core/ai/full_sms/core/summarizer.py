MAX_SMS_CHARS = 160

def summarize_if_needed(text: str) -> str:
    if len(text) <= MAX_SMS_CHARS:
        return text

    # split links
    parts = text.split("Links:")
    main_text = parts[0].strip()
    links = "Links:" + parts[1] if len(parts) > 1 else ""

    allowed_main_len = MAX_SMS_CHARS - len(links) - 3
    short_main = main_text[:allowed_main_len]

    return short_main + "... " + links