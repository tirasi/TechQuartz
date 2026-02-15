from fastapi import APIRouter, Form
from fastapi.responses import PlainTextResponse
from core.response_generator import handle_sms
router = APIRouter()

@router.post("/sms/webhook")
async def sms_webhook(
    Body: str = Form(...),
    From: str = Form(...)
):
    reply = handle_sms(Body, From)

    return PlainTextResponse(
        f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply}</Message>
</Response>""",
        media_type="application/xml"
    )
