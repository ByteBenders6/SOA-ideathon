import requests

MYMEMORY_URL = (
    "https://api.mymemory.translated.net/get"
)


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


def get_language_code(
    language_name
):

    if language_name is None:

        return None


    language_name = str(
        language_name
    ).strip().lower()


    return SUPPORTED_LANGUAGES.get(
        language_name
    )


def translate_text(
    text,
    source_language,
    target_language
):

    params = {

        "q":
            text,

        "langpair":
            f"{source_language}|{target_language}",

        "mt":
            "1"
    }


    try:

        response = requests.get(

            MYMEMORY_URL,

            params=params,

            timeout=15
        )


        response.raise_for_status()


        data = response.json()


        if (
            "responseData"
            not in data
        ):

            return {

                "success": False,

                "translation": None,

                "error":
                    "Unexpected response from "
                    "translation API."
            }


        translation = (
            data[
                "responseData"
            ][
                "translatedText"
            ]
        )


        
        if not translation:

            return {

                "success": False,

                "translation": None,

                "error":
                    "Translation could not be generated."
            }


        return {

            "success": True,

            "translation":
                translation,

            "error": None
        }


    except requests.exceptions.Timeout:

        return {

            "success": False,

            "translation": None,

            "error":
                "Translation request timed out. "
                "Please check your internet connection."
        }


    except requests.exceptions.RequestException as e:

        return {

            "success": False,

            "translation": None,

            "error":
                f"Translation API error: {e}"
        }


    except (
        KeyError,
        TypeError,
        ValueError
    ):

        return {

            "success": False,

            "translation": None,

            "error":
                "Invalid response received from "
                "translation API."
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

            "error":
                "Please enter some text."
        }


    text = str(
        text
    ).strip()


    if not text:

        return {

            "success": False,

            "translation": None,

            "error":
                "Please enter some text."
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

            "error":
                "Source language is not supported."
        }



    if target_code is None:

        return {

            "success": False,

            "translation": None,

            "error":
                "Target language is not supported."
        }



    if source_code == target_code:

        return {

            "success": True,

            "translation":
                text,

            "error": None
        }


    return translate_text(

        text,

        source_code,

        target_code
    )



if __name__ == "__main__":

    result = tourist_translate(

        text=
            "Where is the nearest hotel?",

        source_language=
            "English",

        target_language=
            "Tamil"
    )


    print("\n")

    print("=" * 60)

    print(
        "TOURIST LANGUAGE TRANSLATOR"
    )

    print("=" * 60)


    if result["success"]:

        print(
            "\nTranslation:"
        )

        print(
            result["translation"]
        )

    else:

        print(
            "\nError:"
        )

        print(
            result["error"]
        )