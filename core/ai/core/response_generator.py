from data.rough_data import KNOWLEDGE_BASE
from core.intent_detector import detect_intent
from core.entity_extractor import extract_profile

def handle_sms(message: str, phone: str) -> str:
    print("📨 Incoming SMS:", repr(message))

    intent = detect_intent(message)
    profile = extract_profile(message)

    print("🧠 Detected intent:", intent)
    print("👤 Detected profile:", profile)

    if intent == "unknown":
        return "Sorry, I couldn't understand. Try jobs, internship or schemes."

    return f"Found {intent} opportunities for {profile} profile. Visit https://www.myscheme.gov.in"

def generate_response(intent: str, entities: dict) -> str:
    return handle_sms(entities.get("message", ""), entities.get("phone", ""))