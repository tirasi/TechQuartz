from fastapi import APIRouter, Request
from core.intent_detector import detect_intent
from core.entity_extractor import extract_profile
from core.response_generator import handle_sms
from services.sms_service import send_sms

router = APIRouter()

@router.post("/sms-webhook")
async def sms_webhook(request: Request):
    data = await request.json()
    message = data.get("message", "")
    phone = data.get("phone", "")
    
    response = handle_sms(message, phone)
    await send_sms(phone, response)
    
    return {"status": "success"}