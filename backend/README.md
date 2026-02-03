# Authentication Backend API

A FastAPI-based authentication system with registration, login (password/OTP), and user management.

## Features

- User registration with comprehensive profile fields
- Login with email/phone + password OR OTP via SMS
- JWT token-based authentication
- MongoDB database integration
- SMS OTP delivery via Twilio

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```
MONGODB_URL=mongodb://localhost:27017/auth_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

3. Start MongoDB service

4. Run the application:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Registration
- `POST /register` - Register new user with full profile

### Authentication
- `POST /login` - Login with email/phone + password or request OTP
- `POST /verify-otp` - Verify OTP and get access token
- `POST /send-otp` - Send OTP to user's phone

### User Management
- `GET /me` - Get current user profile (requires authentication)

## Registration Fields

Required:
- first_name, last_name
- email, phone, password
- age, gender
- student_type (undergraduate/postgraduate/intern)
- field_of_study
- current_year, semester
- location

Optional:
- middle_name

## Login Methods

1. **Password Login**: Provide identifier (email/phone) + password
2. **OTP Login**: Provide identifier, system sends OTP via SMS

## Authentication Flow

1. Register user with complete profile
2. Login with chosen method (password/OTP)
3. Receive JWT token
4. Use token in Authorization header: `Bearer <token>`