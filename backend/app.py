from fastapi import FastAPI
from .knowledge_base import search_knowledge

app = FastAPI()

@app.get("/")
def home():
    return {"status": "Server running"}

@app.post("/ask")
def ask(data: dict):
    question = data.get("question", "")
    results = search_knowledge(question)
    return results
