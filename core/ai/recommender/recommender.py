from eligibility.eligibility_engine import is_eligible

def recommend_opportunities(student, opportunities):
    recommendations = []

    for opp in opportunities:
        eligible, reason = is_eligible(student, opp)
        if eligible:
            recommendations.append(opp)

    return recommendations