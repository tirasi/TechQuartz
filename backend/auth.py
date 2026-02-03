from datetime import datetime, timedelta
from jose import JWTError, jwt
from decouple import config
import random
import string
import hashlib
import base64

SECRET_KEY = config("SECRET_KEY", default="your-secret-key-change-in-production")
ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(config("ACCESS_TOKEN_EXPIRE_MINUTES", default="30"))

def verify_password(plain_password: str, hashed_password: str):
    # Simple SHA256 + salt verification
    if len(hashed_password) < 32:
        return False
    salt = hashed_password[:16]
    stored_hash = hashed_password[16:]
    password_hash = hashlib.sha256((plain_password + salt).encode()).hexdigest()
    return password_hash == stored_hash

def get_password_hash(password: str):
    # Simple SHA256 + salt hashing
    salt = base64.b64encode(random.randbytes(16)).decode()[:16]
    password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return salt + password_hash

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return user_id
    except JWTError:
        return None

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


# In-memory OTP storage (use Redis in production)
otp_storage = {}

def normalize_identifier(identifier: str) -> str:
    """Ensure same key format for email/phone OTP storage"""
    if not identifier:
        return ""
    identifier = identifier.strip()
    if "@" in identifier:  # email
        return identifier.lower()
    # phone → digits only
    return "".join(ch for ch in identifier if ch.isdigit())

def store_otp(identifier: str, otp: str):
    identifier = normalize_identifier(identifier)
    print(f"[OTP STORE] id={identifier} otp={otp}")
    otp_storage[identifier] = {
        "otp": otp,
        "expires": datetime.utcnow() + timedelta(minutes=5)
    }

def verify_otp(identifier: str, otp: str):
    identifier = normalize_identifier(identifier)
    print(f"[OTP VERIFY] id={identifier} otp_entered={otp}")
    stored_otp_data = otp_storage.get(identifier)
    print(f"[OTP STORED DATA] {stored_otp_data}")

    if not stored_otp_data:
        return False

    if datetime.utcnow() > stored_otp_data["expires"]:
        del otp_storage[identifier]
        return False

    if stored_otp_data["otp"] == otp:
        del otp_storage[identifier]
        return True

    return False