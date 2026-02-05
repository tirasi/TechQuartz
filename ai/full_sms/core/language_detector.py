# ai/full_sms/core/language_detector.py

def detect_language(message: str) -> str:
    msg = message.lower()

    # Hindi (roman)
    if any(w in msg for w in ["chahiye", "mujhe", "kya", "kaise", "hai"]):
        return "hi"

    # Odia (roman)
    if any(w in msg for w in ["mu", "tume", "khojuchi", "darkar"]):
        return "or"

    # Marathi (roman)
    if any(w in msg for w in ["mala", "pahije", "ahe", "kaay"]):
        return "mr"

    # Bengali (roman)
    if any(w in msg for w in ["amar", "chai", "ki", "lagbe"]):
        return "bn"

    return "en"
