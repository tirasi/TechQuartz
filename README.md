# InfoNest - AI-Powered Opportunity Platform

A fully working AI-powered platform to discover scholarships, internships, schemes, and more.

## Features Implemented

### ✅ Backend (FastAPI + JSON DB)
- Clean FastAPI backend with JWT authentication
- JSON-based database (no MongoDB required)
- Complete auth flow (signup/login)
- Profile management
- Language & voice preferences
- User interests & intents
- Opportunities API

### ✅ Frontend Flow
1. **Auth Page** - Login/Signup
2. **Profile Page** - Student type, gender, location, semester
3. **Onboarding Page** - Language selection + Voice toggle
4. **Preferences Page** - Select interests (Business, IT, Engineering, etc.)
5. **Intent Page** - What you're looking for (with voice input support)
6. **Processing Page** - Loading animation
7. **Dashboard** - View matched opportunities

### ✅ Features
- JWT-based authentication
- Profile completion tracking
- Multi-step onboarding
- Voice input support (Web Speech API)
- Opportunity matching
- Filter by type (scholarship/internship/scheme)
- Match score calculation
- Responsive UI with glassmorphism design

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend:
```bash
python main.py
```

Backend will run on `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to UI folder:
```bash
cd ui
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage Flow

1. **Signup** - Create account with email and password
2. **Profile** - Complete your profile (student type, gender, location, semester)
3. **Language** - Choose language and enable voice if needed
4. **Preferences** - Select your interests
5. **Intent** - Select what you're looking for (use voice or click)
6. **Dashboard** - View personalized opportunities

## API Endpoints

- `POST /signup` - Create new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `POST /profile` - Update profile
- `POST /language` - Update language preferences
- `POST /preferences` - Update interests
- `POST /intent` - Update user intent
- `GET /opportunities` - Get matched opportunities

## Database

The backend uses a simple JSON file (`db.json`) to store user data. No external database required.

## Tech Stack

### Backend
- FastAPI
- JWT authentication
- Passlib (password hashing)
- JSON file storage

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Router
- Web Speech API

## Next Steps (Not Implemented Yet)

- Opportunity details page
- AI voice assistant (Lily)
- AI chatbot
- Recommender system
- Search & advanced filters
- Real scraper integration
- User behavior tracking

## Notes

- Backend runs on port 8000
- Frontend runs on port 5173
- CORS is enabled for all origins (change in production)
- Secret key should be changed in production
- Voice features require HTTPS in production
