from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class StudentType(str, Enum):
    UNDERGRADUATE = "undergraduate"
    POSTGRADUATE = "postgraduate"
    INTERN = "intern"

class UserRegistration(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    middle_name: Optional[str] = Field(None, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\+?[1-9]\d{1,14}$')
    password: str = Field(..., min_length=6, max_length=72)
    age: int = Field(..., ge=16, le=100)
    gender: Gender
    student_type: StudentType
    field_of_study: str = Field(..., min_length=1, max_length=100)
    current_year: int = Field(..., ge=1, le=10)
    semester: int = Field(..., ge=1, le=8)
    location: str = Field(..., min_length=1, max_length=100)

class LoginRequest(BaseModel):
    identifier: str  # email or phone
    password: Optional[str] = None
    login_method: Literal["password", "otp"] = "password"

class OTPRequest(BaseModel):
    identifier: str
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    email: str
    phone: str
    age: int
    gender: str
    student_type: str
    field_of_study: str
    current_year: int
    semester: int
    location: str