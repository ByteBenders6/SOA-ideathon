import requests


LIBRETRANSLATE_URL = "https://translate.terraprint.co/translate"


SUPPORTED_LANGUAGES = {
    "english": "en",
    "odia": "or",
    "hindi": "hi",
    "tamil": "ta",
    "telugu": "te",
    "kannada": "kn",
    "malayalam": "ml",
    "bengali": "bn",
    "marathi": "mr",
    "gujarati": "gu",
    "punjabi": "pa",
    "assamese": "as"
}


def get_language_code(language_name):

    if language_name is None:
        return None

    language_name = str(language_name).strip().lower()

    return SUPPORTED_LANGUAGES.get(language_name)


def translate_text(text, source_language, target_language):

    payload = {
        "q": text,
        "source": source_language,
        "target": target_language,
        "format": "text"
    }

    try:

        response = requests.post(
            LIBRETRANSLATE_URL,
            json=payload,
            headers={
                "Content-Type": "application/json"
            },
            timeout=30
        )

        if not response.ok:

            return {
                "success": False,
                "translation": None,
                "error":
                    f"Translation service returned "
                    f"{response.status_code}"
            }

        data = response.json()

        translation = data.get("translatedText")

        if not translation:

            return {
                "success": False,
                "translation": None,
                "error":
                    "Translation service returned no translation."
            }

        return {
            "success": True,
            "translation": translation,
            "error": None
        }

    except requests.exceptions.Timeout:

        return {
            "success": False,
            "translation": None,
            "error": "Translation request timed out."
        }

    except requests.exceptions.RequestException as e:

        return {
            "success": False,
            "translation": None,
            "error": f"Translation API error: {e}"
        }

    except (ValueError, TypeError):

        return {
            "success": False,
            "translation": None,
            "error": "Invalid translation response."
        }


def tourist_translate(
    text,
    source_language,
    target_language
):

    if text is None:

        return {
            "success": False,
            "translation": None,
            "error": "Please enter some text."
        }

    text = str(text).strip()

    if not text:

        return {
            "success": False,
            "translation": None,
            "error": "Please enter some text."
        }

    source_code = get_language_code(
        source_language
    )

    target_code = get_language_code(
        target_language
    )

    if source_code is None:

        return {
            "success": False,
            "translation": None,
            "error": "Source language is not supported."
        }

    if target_code is None:

        return {
            "success": False,
            "translation": None,
            "error": "Target language is not supported."
        }

    if source_code == target_code:

        return {
            "success": True,
            "translation": text,
            "error": None
        }

    return translate_text(
        text,
        source_code,
        target_code
    )