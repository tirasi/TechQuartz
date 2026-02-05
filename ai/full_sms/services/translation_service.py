# ai/full_sms/services/translation_service.py

TRANSLATIONS = {

    # 🔹 HINDI (roman)
    "hi": {
        "Here are some scholarship opportunities for students.":
        "Yahan students ke liye kuch scholarship ke avsar diye gaye hain.",

        " Links: ":
        " Links: ",

        "Which class or degree are you studying in?":
        "Aap kis class ya degree mein padh rahe ho?",

        "Your category? (General / OBC / SC / ST)":
        "Aapki category kya hai? (General / OBC / SC / ST)",

        "Your gender?":
        "Aapka gender kya hai?",

        "Which state are you from?":
        "Aap kis rajya se ho?"
    },

    # 🔹 ODIA (roman)
    "or": {
        "Here are some scholarship opportunities for students.":
        "Ethi students mananka pain kichhi scholarship sujog achhi.",

        " Links: ":
        " Links: ",

        "Which class or degree are you studying in?":
        "Apana kon class ba degree re padhuchanti?",

        "Your category? (General / OBC / SC / ST)":
        "Apananka category kana? (General / OBC / SC / ST)",

        "Your gender?":
        "Apananka gender kana?",

        "Which state are you from?":
        "Apana kon rajya ru?"
    },

    # 🔹 MARATHI
    "mr": {
        "Here are some scholarship opportunities for students.":
        "विद्यार्थ्यांसाठी काही शिष्यवृत्ती संधी येथे दिल्या आहेत.",

        " Links: ":
        " दुवे: ",

        "Which class or degree are you studying in?":
        "तुम्ही कोणत्या वर्गात किंवा पदवीत शिक्षण घेत आहात?",

        "Your category? (General / OBC / SC / ST)":
        "तुमची प्रवर्ग कोणती आहे? (General / OBC / SC / ST)",

        "Your gender?":
        "तुमचे लिंग काय आहे?",

        "Which state are you from?":
        "तुम्ही कोणत्या राज्यातून आहात?"
    },

    # 🔹 BENGALI (roman)
    "bn": {
        "Here are some scholarship opportunities for students.":
        "Chhatro der jonno kichu scholarship sujog ekhane dewa holo.",

        " Links: ":
        " Links: ",

        "Which class or degree are you studying in?":
        "Tumi kon class ba degree e porcho?",

        "Your category? (General / OBC / SC / ST)":
        "Tomar category ki? (General / OBC / SC / ST)",

        "Your gender?":
        "Tomar gender ki?",

        "Which state are you from?":
        "Tumi kon rajyer?"
    }
}



def translate(text: str, lang: str) -> str:
    if lang == "en":
        return text

    return TRANSLATIONS.get(lang, {}).get(text, text)
