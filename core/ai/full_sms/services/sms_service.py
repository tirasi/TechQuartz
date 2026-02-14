from twilio.rest import Client
import os

client = Client(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)

def send_sms(to_number: str, message: str):
    print("📩 Simulated SMS")
    print("To:", to_number)
    print("Message:", message)
   
    
