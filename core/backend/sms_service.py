import os
import logging
from dotenv import load_dotenv
from twilio.rest import Client

# 🔹 Load environment variables from .env
load_dotenv(dotenv_path=".env")

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Debug prints (you can remove later)
print("TWILIO SID:", TWILIO_ACCOUNT_SID)
print("TWILIO TOKEN:", "SET" if TWILIO_AUTH_TOKEN else "NOT SET")
print("TWILIO PHONE:", TWILIO_PHONE_NUMBER)

# 🔹 Initialize Twilio client
client = None
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
else:
    logging.warning("⚠ Twilio not configured properly — OTP will only appear in terminal.")


async def send_otp_sms(phone_number: str, otp: str) -> bool:
    """
    Sends OTP via Twilio SMS.
    Returns True if successful, False otherwise.
    """

    # If Twilio not configured → fallback to terminal
    if client is None:
        logging.warning(f"[DEV MODE] OTP for {phone_number}: {otp}")
        return True

    try:
        message = client.messages.create(
            body=f"Your OTP is: {otp}. Valid for 5 minutes.",
            from_=TWILIO_PHONE_NUMBER,
            to=phone_number
        )

        logging.info(f"📨 SMS sent successfully to {phone_number}. SID: {message.sid}")
        return True

    except Exception as e:
        logging.error(f"❌ Failed to send SMS to {phone_number}: {e}")
        return False
