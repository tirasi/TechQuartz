# ai/full_sms/core/state_manager.py

import json
import os
from typing import Dict

STATE_FILE = "ai/full_sms/data/user_sessions.json"


def _load_state() -> Dict:
    """Load all user states from file"""
    if not os.path.exists(STATE_FILE):
        return {}

    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_state(data: Dict):
    """Save all user states to file"""
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def get_user_state(phone: str) -> Dict:
    """Get state of a user by phone number"""
    data = _load_state()
    return data.get(phone, {})


def create_user_state(phone: str, intent: str, language: str = "en") -> Dict:
    data = _load_state()

    data[phone] = {
        "intent": intent,
        "language": language,
        "profile": {},
        "step": "start",
        "completed": False
    }

    _save_state(data)
    return data[phone]



def update_user_state(phone: str, key: str, value):
    """Update a specific field in user state"""
    data = _load_state()

    if phone not in data:
        return

    data[phone][key] = value
    _save_state(data)


def update_profile(phone: str, field: str, value):
    """Update profile information like age, education, etc."""
    data = _load_state()

    if phone not in data:
        return

    data[phone]["profile"][field] = value
    _save_state(data)


def set_step(phone: str, step: str):
    """Update conversation step"""
    data = _load_state()

    if phone not in data:
        return

    data[phone]["step"] = step
    _save_state(data)


def complete_session(phone: str):
    """Mark session as completed"""
    data = _load_state()

    if phone not in data:
        return

    data[phone]["completed"] = True
    _save_state(data)


def reset_session(phone: str):
    """Delete user session (start fresh)"""
    data = _load_state()

    if phone in data:
        del data[phone]
        _save_state(data)
