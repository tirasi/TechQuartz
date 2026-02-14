from ai.full_sms.data.knowledge_base import KNOWLEDGE_BASE
from ai.full_sms.core.intent_detector import detect_intent
from ai.full_sms.core.dialog_manager import get_next_question
from ai.full_sms.core.language_detector import detect_language
from ai.full_sms.services.translation_service import translate

from ai.full_sms.core.state_manager import (
    get_user_state,
    create_user_state,
    update_profile,
    set_step,
    complete_session
)

from ai.full_sms.core.summarizer import summarize_if_needed


def handle_sms(message: str, phone: str) -> str:
    print("📨 Incoming SMS:", repr(message))

    state = get_user_state(phone)

    # 🆕 NEW USER
    if not state:
        language = detect_language(message)
        intents = detect_intent(message)
        intent = intents[0]

        state = create_user_state(phone, intent, language)

        field, question = get_next_question(intent, {})
        if question:
            return translate(question, language)

    intent = state["intent"]
    profile = state["profile"]
    step = state["step"]
    language = state.get("language", "en")

    # Save previous answer
    if step != "start" and not state["completed"]:
        update_profile(phone, step, message.lower())

    # Ask next question
    field, question = get_next_question(intent, profile)
    if question:
        set_step(phone, field)
        return translate(question, language)

    # Final response
    complete_session(phone)

    if intent not in KNOWLEDGE_BASE:
        return translate("Sorry, I couldn't understand your request.", language)

    data = KNOWLEDGE_BASE[intent]["general"]

    response = (
        data["text"] +
        " Links: " +
        ", ".join(data["links"])
    )

    return summarize_if_needed(translate(response, language))
