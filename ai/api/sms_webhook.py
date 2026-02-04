from fastapi import APIRouter, Request
from core.intent_detector import detect_intent
from core.entity_extractor import extract_entities
from core.response_generator import generate_response
from services.sms_service import send_sms

router = APIRouter()

@router.post("/sms-webhook")
async def handle_sms(request: Request):
    data = await request.json()
    message = data.get("message", "")
    phone = data.get("phone", "")
    
    intent = detect_intent(message)
    entities = extract_entities(message)
    response = generate_response(intent, entities)
    
    await send_sms(phone, response)
    
    return {"status": "success"}