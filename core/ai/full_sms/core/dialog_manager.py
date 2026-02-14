# ai/full_sms/core/dialog_manager.py

from ai.full_sms.data.questions import QUESTION_FLOW


def get_next_question(intent: str, profile: dict):
    """
    Returns (field, question) for the next unanswered field
    """
    if intent not in QUESTION_FLOW:
        return None, None

    for field, question in QUESTION_FLOW[intent]:
        if field not in profile:
            return field, question

    return None, None  # all questions answered
