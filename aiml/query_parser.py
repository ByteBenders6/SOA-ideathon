import re

SUPPORTED_STATES = [
    "Odisha",
    "Meghalaya",
    "Himachal Pradesh"
]

GROUP_TYPES = [
    "family",
    "friends",
    "solo",
    "couple"
]

def extract_state(text):

    if not text:
        return None

    text = str(text).strip().lower()

    # Check longer state names first
    # Example: Himachal Pradesh
    states_sorted = sorted(
        SUPPORTED_STATES,
        key=len,
        reverse=True
    )

    for state in states_sorted:

        if state.lower() in text:

            return state

    return None


def extract_budget(text):

    if not text:
        return None

    text = str(text).lower().strip()

    # Remove commas
    text = text.replace(",", "")



    match = re.search(
        r'₹\s*(\d+(?:\.\d+)?)',
        text
    )

    if match:

        return int(
            float(
                match.group(1)
            )
        )



    match = re.search(
        r'\brs\.?\s*(\d+(?:\.\d+)?)',
        text
    )

    if match:

        return int(
            float(
                match.group(1)
            )
        )



    match = re.search(
        r'(\d+(?:\.\d+)?)\s*k\b',
        text
    )

    if match:

        return int(
            float(
                match.group(1)
            ) * 1000
        )


    match = re.search(
        r'\bbudget\s*(?:of\s*)?(\d+(?:\.\d+)?)',
        text
    )

    if match:

        return int(
            float(
                match.group(1)
            )
        )


    match = re.search(
        r'(\d+(?:\.\d+)?)\s*'
        r'(?:rupees|rs|budget)\b',
        text
    )

    if match:

        return int(
            float(
                match.group(1)
            )
        )


    return None



def extract_group(text):

    if not text:
        return None

    text = str(text).lower().strip()


    if re.search(
        r'\bcouple\b',
        text
    ):

        return "Couple"


    if re.search(
        r'\bfamily\b',
        text
    ):

        return "Family"



    if re.search(
        r'\bfriends?\b',
        text
    ):

        return "Friends"


    # Solo
    if re.search(
        r'\bsolo\b',
        text
    ):

        return "Solo"


    return None


def extract_duration(text):

    if not text:
        return None

    text = str(text).lower().strip()


    match = re.search(
        r'(\d+)\s*(?:week|weeks)\b',
        text
    )

    if match:

        weeks = int(
            match.group(1)
        )

        return weeks * 7


    match = re.search(
        r'(\d+)\s*(?:day|days)\b',
        text
    )

    if match:

        return int(
            match.group(1)
        )




    if re.search(
        r'\b(?:a|one)\s*week\b',
        text
    ):

        return 7



    if re.search(
        r'\b(?:a|one)\s*day\b',
        text
    ):

        return 1


    return None



def parse_user_query(query):

    return {

        "state":
            extract_state(query),

        "budget":
            extract_budget(query),

        "group_type":
            extract_group(query),

        "duration":
            extract_duration(query)
    }


if __name__ == "__main__":

    print("=" * 60)

    print(
        "SMART AI TOURISM QUERY PARSER"
    )

    print("=" * 60)


    query = input(
        "\nEnter your travel query:\n"
    )


    result = parse_user_query(
        query
    )


    print("\nParsed Input:")

    print(
        result
    )