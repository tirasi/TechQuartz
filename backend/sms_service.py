from twilio.rest import Client
from decouple import config
import logging

TWILIO_ACCOUNT_SID = config("TWILIO_ACCOUNT_SID", default="")
TWILIO_AUTH_TOKEN = config("TWILIO_AUTH_TOKEN", default="")
TWILIO_PHONE_NUMBER = config("TWILIO_PHONE_NUMBER", default="")

client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

async def send_otp_sms(phone_number: str, otp: str):
    if not client:
        logging.warning("Twilio not configured, OTP would be sent to: " + phone_number + " OTP: " + otp)
        return True
        
    try:
        message = client.messages.create(
            body=f"Your OTP is: {otp}. Valid for 5 minutes.",
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        logging.info(f"SMS sent successfully to {phone_number}")
        return True
    except Exception as e:
        logging.error(f"Failed to send SMS to {phone_number}: {e}")
        return False