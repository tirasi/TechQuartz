from fastapi import FastAPI
from ai.full_sms.api.sms_webhook import router as sms_router


app = FastAPI(title="AI Platform")

app.include_router(sms_router)

