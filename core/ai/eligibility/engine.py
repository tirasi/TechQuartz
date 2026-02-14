from .eligibility_rules import check_age, check_education

def is_eligible(student, opportunity):
    if not check_education(student["education_level"], opportunity["education_level"]):
        return False, "Education level does not match"

    if not check_age(student["age"], opportunity["eligibility"]):
        return False, "Age criteria not satisfied"

    return True, "All eligibility criteria satisfied"