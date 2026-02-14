def check_age(student_age, eligibility):
    return eligibility["min_age"] <= student_age <= eligibility["max_age"]

def check_education(student_level, required_level):
    return student_level == required_level