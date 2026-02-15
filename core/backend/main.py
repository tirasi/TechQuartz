from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
import os
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

DB_PATH = os.path.join(os.path.dirname(__file__), "db.json")

def init_db():
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f:
            json.dump({"users": []}, f)

init_db()

def load_db():
    with open(DB_PATH, "r") as f:
        return json.load(f)

def save_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except:
        return None

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No token")
    
    token = authorization.replace("Bearer ", "")
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    db = load_db()
    user = next((u for u in db["users"] if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/signup")
async def signup(data: dict):
    email = data.get("email")
    password = data.get("password")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    
    db = load_db()
    
    if any(u.get("email") == email for u in db["users"]):
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = {
        "id": email,
        "email": email,
        "password": hash_password(password),
        "onboarding_completed": False,
        "profile_completed": False,
        "created_at": datetime.utcnow().isoformat()
    }
    
    db["users"].append(user)
    save_db(db)
    
    token = create_token(user["id"])
    return {"access_token": token, "token_type": "bearer"}

@app.post("/login")
async def login(data: dict):
    identifier = data.get("identifier")
    password = data.get("password")
    
    db = load_db()
    
    user = next((u for u in db["users"] if u.get("email") == identifier), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password")
    
    token = create_token(user["id"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "onboarding_completed": user.get("onboarding_completed", False),
        "profile_completed": user.get("profile_completed", False)
    }

@app.get("/me")
async def get_me(authorization: str = Header(None)):
    current_user = get_current_user(authorization)
    user_copy = current_user.copy()
    user_copy.pop("password", None)
    return user_copy

@app.post("/profile")
async def update_profile(data: dict, authorization: str = Header(None)):
    current_user = get_current_user(authorization)
    db = load_db()
    
    for user in db["users"]:
        if user["id"] == current_user["id"]:
            user["student_type"] = data.get("student_type")
            user["gender"] = data.get("gender")
            user["location"] = data.get("location")
            user["semester"] = data.get("semester")
            user["profile_completed"] = True
            break
    
    save_db(db)
    return {"message": "Profile updated"}

@app.post("/language")
async def update_language(data: dict, authorization: str = Header(None)):
    current_user = get_current_user(authorization)
    db = load_db()
    
    for user in db["users"]:
        if user["id"] == current_user["id"]:
            user["language"] = data.get("language")
            user["voice_enabled"] = data.get("voice_enabled")
            break
    
    save_db(db)
    return {"message": "Language updated"}

@app.post("/preferences")
async def update_preferences(data: dict, authorization: str = Header(None)):
    current_user = get_current_user(authorization)
    db = load_db()
    
    for user in db["users"]:
        if user["id"] == current_user["id"]:
            user["interests"] = data.get("interests")
            break
    
    save_db(db)
    return {"message": "Preferences updated"}

@app.post("/intent")
async def update_intent(data: dict, authorization: str = Header(None)):
    current_user = get_current_user(authorization)
    db = load_db()
    
    for user in db["users"]:
        if user["id"] == current_user["id"]:
            user["intents"] = data.get("intents")
            user["onboarding_completed"] = True
            break
    
    save_db(db)
    return {"message": "Intent updated"}

@app.get("/opportunities")
async def get_opportunities(authorization: str = Header(None)):
    current_user = get_current_user(authorization)
    
    mock_opps = [
        {
            "id": "1",
            "title": "National Scholarship for SC Students",
            "type": "scholarship",
            "provider": "Ministry of Social Justice",
            "amount": "₹50,000/year",
            "deadline": "2026-03-31",
            "description": "Scholarship for SC students pursuing higher education",
            "eligibility": "SC category, Annual income < 2.5L",
            "matchScore": 95,
            "whyMatch": "Matches your education level and category"
        },
        {
            "id": "2",
            "title": "AICTE Pragati Scholarship for Girls",
            "type": "scholarship",
            "provider": "AICTE",
            "amount": "₹50,000/year",
            "deadline": "2026-04-15",
            "description": "Scholarship for girl students in technical education",
            "eligibility": "Female, Technical degree/diploma",
            "matchScore": 92,
            "whyMatch": "Perfect match for female engineering students"
        },
        {
            "id": "3",
            "title": "Google Summer of Code",
            "type": "internship",
            "provider": "Google",
            "amount": "$3000-$6600",
            "deadline": "2026-04-02",
            "description": "Open source development internship",
            "eligibility": "Students 18+, Programming skills",
            "matchScore": 88,
            "whyMatch": "Matches your IT interests"
        },
        {
            "id": "4",
            "title": "PM-YUVA Scheme",
            "type": "scheme",
            "provider": "Ministry of Education",
            "amount": "₹50,000",
            "deadline": "2026-05-31",
            "description": "Mentorship program for young authors",
            "eligibility": "Age 30 or below",
            "matchScore": 85,
            "whyMatch": "Great for creative students"
        },
        {
            "id": "5",
            "title": "Smart India Hackathon",
            "type": "internship",
            "provider": "AICTE",
            "amount": "₹1,00,000",
            "deadline": "2026-03-15",
            "description": "National level hackathon for students",
            "eligibility": "Students from recognized institutions",
            "matchScore": 90,
            "whyMatch": "Perfect for tech enthusiasts"
        }
    ]
    
    return {"opportunities": mock_opps}

@app.post("/sms-webhook")
async def sms_webhook(data: dict):
    message = data.get("message", "")
    phone = data.get("phone", "")
    
    response = f"Thanks for your message: {message}. We'll get back to you soon!"
    
    return {"status": "success", "response": response, "phone": phone}

@app.get("/")
async def root():
    return {"message": "InfoNest API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
