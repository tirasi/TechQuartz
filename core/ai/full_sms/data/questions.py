# ai/full_sms/data/questions.py

QUESTION_FLOW = {

    # 🔹 JOB / INTERNSHIP
    "job": [
        ("age", "What is your age?"),
        ("education", "What is your education or experience?"),
        ("location", "Which city/state are you from?"),
        ("work_mode", "Do you prefer WFH or WFO?")
    ],

    "internship": [
        ("education", "Which degree or class are you studying in?"),
        ("field", "Which field are you interested in?"),
        ("location", "Which city/state are you from?"),
        ("work_mode", "Do you prefer WFH or WFO?")
    ],

    # 🔹 SCHOLARSHIP
    "scholarship": [
        ("education", "Which class or degree are you studying in?"),
        ("category", "Your category? (General / OBC / SC / ST)"),
        ("gender", "Your gender?"),
        ("location", "Which state are you from?")
    ],

    # 🔹 FELLOWSHIP
    "fellowship": [
        ("education", "Your highest qualification?"),
        ("field", "Which field or subject?"),
        ("gender", "Your gender?"),
        ("location", "Which state are you from?")
    ],

    # 🔹 EDUCATION (subject / exam help)
    "education": [
        ("class", "Which class or semester?"),
        ("subject", "Which subject do you need help with?")
    ],

    # 🔹 GOVERNMENT / FINANCIAL SCHEMES
    "scheme": [
        ("age", "What is your age?"),
        ("gender", "Your gender?"),
        ("category", "Your category? (General / OBC / SC / ST)"),
        ("income", "Approx annual family income?"),
        ("location", "Which state are you from?")
    ]
}
