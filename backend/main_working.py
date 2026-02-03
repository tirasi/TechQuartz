from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from models import UserRegistration, LoginRequest, Token
from auth import get_password_hash, create_access_token, verify_password
from datetime import timedelta
import json
import os

app = FastAPI(title="Authentication API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File-based storage for testing
USERS_FILE = "users.json"

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

@app.get("/")
async def root():
    return {"message": "Authentication API is running"}

@app.post("/register")
async def register(user_data: UserRegistration):
    users = load_users()
    
    # Check if user exists
    if user_data.email in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or phone already exists"
        )
    
    for user in users.values():
        if user.get('phone') == user_data.phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email or phone already exists"
            )
    
    # Hash password and save user
    hashed_password = get_password_hash(user_data.password)
    users[user_data.email] = {
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
    
    save_users(users)
    return {"message": "User registered successfully", "user_id": user_data.email}

@app.post("/login")
async def login(login_data: LoginRequest):
    users = load_users()
    
    # Find user by email or phone
    user = None
    if login_data.identifier in users:
        user = users[login_data.identifier]
    else:
        for u in users.values():
            if u.get('phone') == login_data.identifier:
                user = u
                break
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if login_data.login_method == "password":
        if not login_data.password or not verify_password(login_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    elif login_data.login_method == "otp":
        return {"message": "OTP sent successfully", "requires_otp": True}
    
    # Create token
    access_token = create_access_token(data={"sub": user["email"]}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}