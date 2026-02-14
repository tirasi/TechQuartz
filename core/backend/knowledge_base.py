import json
from pathlib import Path

print("knowledge_base.py LOADED")

DATA_PATH = Path(__file__).parent.parent / "data" / "scraped_data.json"


def search_knowledge(query: str):
    if not query:
        return []

    query_words = query.lower().split()
    results = []

    if not DATA_PATH.exists():
        print("❌ scraped_data.json not found")
        return []

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data:
        content = item.get("content", "").lower()

        if any(word in content for word in query_words):
            results.append({
                "category": item.get("category"),
                "url": item.get("url"),
                "snippet": item.get("content", "")[:300]
            })

    return results
