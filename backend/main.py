from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
import logging
from dotenv import load_dotenv
load_dotenv()

from models import UserRegistration, LoginRequest, OTPRequest, Token, UserResponse
from database import connect_to_mongo, close_mongo_connection
from auth import (
    verify_password, create_access_token, verify_token,
    generate_otp, store_otp, verify_otp, ACCESS_TOKEN_EXPIRE_MINUTES
)
from user_service import create_user, get_user_by_identifier, get_user_by_id, user_to_response
from sms_service import send_otp_sms

app = FastAPI(title="Authentication API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = verify_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user = await get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.post("/register")
async def register(user_data: UserRegistration):
    user_id = await create_user(user_data)
    if user_id is None:
        raise HTTPException(status_code=400, detail="User already exists")
    return {"message": "User registered successfully", "user_id": user_id}


@app.post("/login")
async def login(login_data: LoginRequest):
    user = await get_user_by_identifier(login_data.identifier)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # PASSWORD LOGIN
    if login_data.login_method == "password":
        if not login_data.password or not verify_password(login_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token = create_access_token(
            data={"sub": str(user["_id"])},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer"}

    # OTP LOGIN
    elif login_data.login_method == "otp":
        otp = generate_otp()
        store_otp(login_data.identifier, otp)

        # SEND SMS
        if not await send_otp_sms(user["phone"], otp):
            raise HTTPException(status_code=500, detail="Failed to send OTP")

        return {"message": "OTP sent successfully", "requires_otp": True}


@app.post("/verify-otp")
async def verify_otp_endpoint(otp_data: OTPRequest):
    user = await get_user_by_identifier(otp_data.identifier)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_otp(otp_data.identifier, otp_data.otp):
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me")
async def get_current_user_info(current_user=Depends(get_current_user)):
    return user_to_response(current_user)


@app.get("/")
async def root():
    return {"message": "Authentication API is running"}
