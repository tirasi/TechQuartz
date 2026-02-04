from ai.full_sms.data.knowledge_base import KNOWLEDGE_BASE
from ai.full_sms.core.intent_detector import detect_intent
from ai.full_sms.core.entity_extractor import extract_profile
from ai.full_sms.core.summarizer import summarize_if_needed
from ai.full_sms.services.sms_service import send_sms

def handle_sms(message: str, phone: str) -> str:
    intent = detect_intent(message)
    profile = extract_profile(message)

    if intent not in KNOWLEDGE_BASE:
        return "Sorry, I couldn't understand. Try jobs, internship or schemes."

    category_data = KNOWLEDGE_BASE[intent]
    user_data = category_data.get(profile) or category_data.get("general")

    if not user_data:
        return "Info not found. Visit https://www.myscheme.gov.in"

    long_text = (
        user_data["text"]
        + " Links: "
        + ", ".join(user_data["links"])
    )

    final_sms = summarize_if_needed(long_text)

    # simulated SMS (no Twilio)
    send_sms(phone, final_sms)

    return final_sms
