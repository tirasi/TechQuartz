def suggest_alternatives(missed_opportunity, all_opportunities):
    alternatives = []

    for opp in all_opportunities:
        if (
            opp["category"] == missed_opportunity["category"]
            and opp["education_level"] == missed_opportunity["education_level"]
            and opp["id"] != missed_opportunity["id"]
        ):
            alternatives.append(opp)

    return alternatives[:3]