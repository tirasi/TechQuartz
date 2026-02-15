from fastapi import FastAPI
from api.sms_webhook import router as sms_router

app = FastAPI(title="AI Platform")

app.include_router(sms_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
