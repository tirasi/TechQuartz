from dateutil.parser import parse

def rank_by_deadline(opportunities):
    return sorted(opportunities, key=lambda x: parse(x["deadline"]))