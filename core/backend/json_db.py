import json
import os

DB_FILE = "users.json"

def load_users():
    if not os.path.exists(DB_FILE):
        return []

    with open(DB_FILE, "r") as f:
        data = json.load(f)
        return data.get("users", [])

def save_users(users):
    with open(DB_FILE, "w") as f:
        json.dump({"users": users}, f, indent=4)
