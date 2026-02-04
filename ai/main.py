from fastapi import FastAPI
from ai.full_sms.api.sms_webhook import router as sms_router

app = FastAPI(title="SETU AI Service")

app.include_router(sms_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
