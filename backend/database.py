from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config
import logging

MONGODB_URL = config("MONGODB_URL", default="mongodb://localhost:27017/auth_db")

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    try:
        db.client = AsyncIOMotorClient(MONGODB_URL)
        db.database = db.client.auth_db
        # Test connection
        await db.client.admin.command('ping')
        logging.info("Connected to MongoDB")
    except Exception as e:
        logging.error(f"Could not connect to MongoDB: {e}")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        logging.info("Disconnected from MongoDB")

def get_database():
    return db.database