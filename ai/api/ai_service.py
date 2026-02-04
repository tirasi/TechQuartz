from fastapi import FastAPI
import json

from recommender.recommender import recommend_opportunities
from recommender.ranking import rank_by_deadline
from recommender.explanation import generate_explanation

app = FastAPI(title="SETU AI Service")

# Load data
with open("data/opportunities.json") as f:
    opportunities = json.load(f)

@app.post("/recommend")
def recommend(student: dict):
    eligible_opps = recommend_opportunities(student, opportunities)
    ranked = rank_by_deadline(eligible_opps)

    response = []
    for opp in ranked:
        response.append({
            "id": opp["id"],
            "title": opp["title"],
            "deadline": opp["deadline"],
            "link": opp["link"],
            "explanation": generate_explanation(student, opp)
        })

    return response