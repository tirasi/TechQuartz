def generate_explanation(student, opportunity):
    return (
        f"This opportunity is recommended because you are a "
        f"{student['education_level']} student and meet the age criteria."
    )