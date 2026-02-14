from models import UserRegistration, UserResponse
from auth import get_password_hash
from json_db import load_users, save_users
import re


# ================= CREATE USER =================
async def create_user(user_data: UserRegistration):

    users = load_users()

    # check existing
    for user in users:
        if user["email"] == user_data.email or user["phone"] == user_data.phone:
            return None

    hashed_password = get_password_hash(user_data.password)

    user = {
        "first_name": user_data.first_name,
        "middle_name": user_data.middle_name,
        "last_name": user_data.last_name,
        "email": user_data.email,
        "phone": user_data.phone,
        "password": hashed_password,
        "age": user_data.age,
        "gender": user_data.gender,
        "student_type": user_data.student_type,
        "field_of_study": user_data.field_of_study,
        "current_year": user_data.current_year,
        "semester": user_data.semester,
        "location": user_data.location,

        # onboarding state
        "onboarding_completed": False,
        "language_selected": False,
        "voice_enabled": False
    }

    users.append(user)
    save_users(users)

    return user_data.email


# ================= GET USER =================
async def get_user_by_identifier(identifier: str):

    users = load_users()

    for user in users:
        if user["email"] == identifier or user["phone"] == identifier:
            return user

    return None


# ================= GET USER BY ID =================
async def get_user_by_id(user_id: str):

    users = load_users()

    for user in users:
        if user["email"] == user_id:
            return user

    return None


# ================= RESPONSE =================
def user_to_response(user_doc) -> UserResponse:

    return UserResponse(
        id=user_doc["email"],
        first_name=user_doc["first_name"],
        middle_name=user_doc.get("middle_name"),
        last_name=user_doc["last_name"],
        email=user_doc["email"],
        phone=user_doc["phone"],
        age=user_doc["age"],
        gender=user_doc["gender"],
        student_type=user_doc["student_type"],
        field_of_study=user_doc["field_of_study"],
        current_year=user_doc["current_year"],
        semester=user_doc["semester"],
        location=user_doc["location"]
    )
