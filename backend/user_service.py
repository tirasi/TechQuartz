from database import get_database
from models import UserRegistration, UserResponse
from auth import get_password_hash
from bson import ObjectId
import re

async def create_user(user_data: UserRegistration):
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({
        "$or": [
            {"email": user_data.email},
            {"phone": user_data.phone}
        ]
    })
    
    if existing_user:
        return None
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user document
    user_doc = {
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
        "location": user_data.location
    }
    
    result = await db.users.insert_one(user_doc)
    return str(result.inserted_id)

async def get_user_by_identifier(identifier: str):
    db = get_database()
    
    # Check if identifier is email or phone
    if re.match(r'^[^@]+@[^@]+\.[^@]+$', identifier):
        query = {"email": identifier}
    else:
        query = {"phone": identifier}
    
    user = await db.users.find_one(query)
    return user

async def get_user_by_id(user_id: str):
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return user

def user_to_response(user_doc) -> UserResponse:
    return UserResponse(
        id=str(user_doc["_id"]),
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