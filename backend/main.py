from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
import logging

from models import UserRegistration, LoginRequest, OTPRequest, Token, UserResponse
from database import connect_to_mongo, close_mongo_connection
from auth import (
    verify_password, create_access_token, verify_token, 
    generate_otp, store_otp, verify_otp, ACCESS_TOKEN_EXPIRE_MINUTES
)
from user_service import create_user, get_user_by_identifier, get_user_by_id, user_to_response
from sms_service import send_otp_sms

app = FastAPI(title="Authentication API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://127.0.0.1:5500"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Database events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = verify_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

@app.post("/register", response_model=dict)
async def register(user_data: UserRegistration):
    user_id = await create_user(user_data)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or phone already exists"
        )
    
    return {"message": "User registered successfully", "user_id": user_id}

@app.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    user = await get_user_by_identifier(login_data.identifier)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if login_data.login_method == "password":
        if not login_data.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required for password login"
            )
        
        if not verify_password(login_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    
    elif login_data.login_method == "otp":
        # Generate and store OTP
        otp = generate_otp()
        store_otp(login_data.identifier, otp)
        
        # For testing: return OTP in response (remove in production)
        return {"message": "OTP sent successfully", "requires_otp": True, "otp_for_testing": otp}
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/verify-otp", response_model=Token)
async def verify_otp_endpoint(otp_data: OTPRequest):
    user = await get_user_by_identifier(otp_data.identifier)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not verify_otp(otp_data.identifier, otp_data.otp):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/send-otp")
async def send_otp_endpoint(identifier: str):
    user = await get_user_by_identifier(identifier)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    otp = generate_otp()
    store_otp(identifier, otp)
    
    if not await send_otp_sms(user["phone"], otp):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )
    
    return {"message": "OTP sent successfully"}

@app.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    return user_to_response(current_user)

@app.get("/")
async def root():
    return {"message": "Authentication API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)