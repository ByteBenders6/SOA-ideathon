from recommendation_engine import run_recommendation_system
from query_parser import parse_user_query
from translator import tourist_translate


def display_weather(weather):

    print("\nLIVE WEATHER")
    print("----------------------------------------")

    if not weather:
        print("Live weather unavailable.")
        return

    print(
        "Location:",
        weather.get("location", "Unknown")
    )

    print(
        "Temperature:",
        weather.get("temperature", "Unknown"),
        "°C"
    )

    print(
        "Feels Like:",
        weather.get("feels_like", "Unknown"),
        "°C"
    )

    print(
        "Humidity:",
        weather.get("humidity", "Unknown"),
        "%"
    )

    print(
        "Condition:",
        weather.get("condition", "Unknown")
    )

    print(
        "Description:",
        weather.get("description", "Unknown")
    )

    print(
        "Rainfall:",
        weather.get("rainfall", 0),
        "mm"
    )

    print(
        "Wind Speed:",
        weather.get("wind_speed", 0),
        "m/s"
    )


def display_wikipedia(wikipedia):

    print("\nWIKIPEDIA")
    print("----------------------------------------")

    if not wikipedia:
        print("Wikipedia data unavailable.")
        return

    if wikipedia.get("success", False):

        print(
            "Title:",
            wikipedia.get(
                "title",
                "Unknown"
            )
        )

        print(
            "Description:",
            wikipedia.get(
                "description",
                "No description available."
            )
        )

        if wikipedia.get("url"):

            print(
                "Wikipedia URL:",
                wikipedia.get("url")
            )

    else:

        print("Wikipedia data unavailable.")

        print(
            "Error:",
            wikipedia.get(
                "error",
                "Unknown error"
            )
        )


def display_facilities(facilities):

    print("\nNEARBY FACILITIES")
    print("----------------------------------------")

    if not facilities:
        print("Nearby facility data unavailable.")
        return

    facility_names = {

        "police_station":
            "Police Stations",

        "hospital":
            "Hospitals",

        "petrol_pump":
            "Petrol Pumps",

        "hotel":
            "Hotels",

        "restaurant":
            "Restaurants",

        "market":
            "Markets",

        "atm":
            "ATMs"
    }

    for category, places in facilities.items():

        display_name = facility_names.get(
            category,
            category.replace(
                "_",
                " "
            ).title()
        )

        print(
            f"\n{display_name}:"
        )

        if not places:

            print(
                "  No places found."
            )

            continue

        for index, place in enumerate(
            places[:10],
            start=1
        ):

            print(
                f"  {index}.",
                place.get(
                    "name",
                    "Unnamed"
                )
            )

            address = place.get(
                "address"
            )

            if address:

                print(
                    "     Address:",
                    address
                )

            rating = place.get(
                "rating"
            )

            if rating is not None:

                print(
                    "     Rating:",
                    rating
                )

            maps_url = place.get(
                "maps_url"
            )

            if maps_url:

                print(
                    "     Maps:",
                    maps_url
                )


def display_location(destination):

    location = destination.get(
        "location"
    )

    print("\nLOCATION")
    print("----------------------------------------")

    if not location:

        print(
            "Location unavailable."
        )

        return

    print(
        "Address:",
        location.get(
            "formatted_address",
            "Unknown"
        )
    )


def display_destination(destination):

    print(
        "\n----------------------------------------"
    )

    print(
        "Place:",
        destination.get(
            "place_name",
            "Unknown"
        )
    )

    print(
        "State:",
        destination.get(
            "state",
            "Unknown"
        )
    )

    print(
        "Category:",
        destination.get(
            "category",
            "Unknown"
        )
    )

    print(
        "Hidden Gem:",
        destination.get(
            "hidden_gem",
            "Unknown"
        )
    )

    print(
        "Estimated Budget:",
        destination.get(
            "estimated_budget",
            "Unknown"
        )
    )

    print(
        "Best Time:",
        destination.get(
            "best_time_to_visit",
            "Unknown"
        )
    )

    # Distance comes directly from dataset
    print(
        "Distance to Hidden Gem:",
        destination.get(
            "distance",
            "Unknown"
        )
    )

    print(
        "Description:",
        destination.get(
            "description",
            "No description available."
        )
    )

    print(
        "Crowd Prediction:",
        destination.get(
            "crowd_prediction",
            "Unknown"
        )
    )

    risk = destination.get(
        "ai_travel_index",
        {}
    )

    if isinstance(risk, dict):

        print(
            "AI Travel Risk Score:",
            risk.get(
                "score",
                "Unknown"
            )
        )

        print(
            "AI Travel Risk Level:",
            risk.get(
                "level",
                "Unknown"
            )
        )

    else:

        print(
            "AI Travel Risk Score:",
            risk
        )

        print(
            "AI Travel Risk Level:",
            "Unknown"
        )

    print(
        "Terrain:",
        destination.get(
            "terrain_type",
            "Unknown"
        )
    )

    print(
        "Road Type:",
        destination.get(
            "road_type",
            "Unknown"
        )
    )

    print(
        "Road Condition:",
        destination.get(
            "road_condition",
            "Unknown"
        )
    )

    print(
        "Vehicle Suitability:",
        destination.get(
            "vehicle_suitability",
            "Unknown"
        )
    )

    print(
        "Traffic Warning:",
        destination.get(
            "traffic_warning",
            "Unknown"
        )
    )

    print(
        "Opening Time:",
        destination.get(
            "opening_time",
            "Unknown"
        )
    )

    print(
        "Closing Time:",
        destination.get(
            "closing_time",
            "Unknown"
        )
    )

    print(
        "Nearby Hotels:",
        destination.get(
            "nearby_hotels",
            "Unknown"
        )
    )

    print(
        "Nearby Restaurants:",
        destination.get(
            "nearby_restaurants",
            "Unknown"
        )
    )

    print(
        "Rating:",
        destination.get(
            "rating",
            "Unknown"
        )
    )

    print(
        "Recommendation Score:",
        destination.get(
            "recommendation_score",
            "Unknown"
        )
    )

    display_location(
        destination
    )

    display_weather(
        destination.get(
            "live_weather"
        )
    )

    display_wikipedia(
        destination.get(
            "wikipedia"
        )
    )

    display_facilities(
        destination.get(
            "facilities"
        )
    )


def main():

    print("=" * 60)

    print(
        "          SMART AI TOURISM RECOMMENDATION SYSTEM"
    )

    print("=" * 60)

    query = input(
        "\nDescribe your travel requirement:\n"
    ).strip()

    if not query:

        print(
            "\nNo travel requirement entered."
        )

        return

    try:

        parsed = parse_user_query(
            query
        )

    except Exception as error:

        print(
            "\nQuery Parser Error:"
        )

        print(error)

        return

    state = parsed.get(
        "state"
    )

    budget = parsed.get(
        "budget"
    )

    group = parsed.get(
        "group_type"
    )

    duration = parsed.get(
        "duration"
    )

    if state is None:

        print(
            "\nCould not identify the state."
        )

        print(
            "Example:"
        )

        print(
            "Odisha, budget 10000, family, 7 days"
        )

        return

    if budget is None:

        print(
            "\nCould not identify the budget."
        )

        print(
            "Example:"
        )

        print(
            "10k or 10000"
        )

        return

    if group is None:

        print(
            "\nCould not identify the group type."
        )

        print(
            "Please mention Family, Couple, "
            "Friends or Solo."
        )

        return

    if duration is None:

        print(
            "\nCould not identify the duration."
        )

        print(
            "Example:"
        )

        print(
            "3 days or 1 week"
        )

        return

    print("\n")

    print("=" * 60)

    print(
        "UNDERSTOOD TRAVEL REQUIREMENT"
    )

    print("=" * 60)

    print(
        "State       :",
        state
    )

    print(
        "Budget      : ₹",
        budget
    )

    print(
        "Group Type  :",
        group
    )

    print(
        "Duration    :",
        duration,
        "days"
    )

    try:

        result = run_recommendation_system(

            state=state,

            budget=budget,

            group_type=group,

            duration=duration
        )

    except Exception as error:

        print(
            "\nRecommendation System Error:"
        )

        print(error)

        return

    print("\n")

    print("=" * 60)

    print(
        "RECOMMENDED DESTINATIONS"
    )

    print("=" * 60)

    recommendations = result.get(
        "recommendations",
        []
    )

    if not recommendations:

        print(
            "\nNo suitable destination found."
        )

    else:

        for destination in recommendations:

            display_destination(
                destination
            )

    print("\n")

    print("=" * 60)

    print(
        "SMART DESTINATION SWITCHING"
    )

    print("=" * 60)

    switching = result.get(
        "smart_destination_switching",
        {}
    )

    selected = switching.get(
        "selected"
    )

    alternative = switching.get(
        "alternative"
    )

    if selected:

        print(
            "\nSelected Destination:",
            selected.get(
                "place_name",
                "Unknown"
            )
        )

    else:

        print(
            "\nNo destination selected."
        )

    if alternative:

        print(
            "Original Destination:",
            alternative.get(
                "place_name",
                "Unknown"
            )
        )

    print(
        "Reason:",
        switching.get(
            "reason",
            "No reason available."
        )
    )

    print("\n")

    print("=" * 60)

    print(
        "TOURIST LANGUAGE TRANSLATOR"
    )

    print("=" * 60)

    choice = input(
        "\nDo you want to translate a sentence? "
        "(yes/no): "
    ).strip().lower()

    if choice == "yes":

        source = input(
            "Source Language: "
        ).strip()

        target = input(
            "Target Language: "
        ).strip()

        text = input(
            "Enter Sentence: "
        ).strip()

        try:

            translated = tourist_translate(

                text=text,

                source_language=source,

                target_language=target
            )

            if translated.get(
                "success",
                False
            ):

                print(
                    "\nTranslated Text:"
                )

                print(
                    translated.get(
                        "translation",
                        ""
                    )
                )

            else:

                print(
                    "\nTranslation Error:"
                )

                print(
                    translated.get(
                        "error",
                        "Unknown translation error."
                    )
                )

        except Exception as error:

            print(
                "\nTranslation Error:"
            )

            print(error)

    elif choice == "no":

        print(
            "\nTranslator skipped."
        )

    else:

        print(
            "\nInvalid choice. Translator skipped."
        )

    print("\n")

    print("=" * 60)

    print(
        "          END OF RECOMMENDATION SYSTEM"
    )

    print("=" * 60)


if __name__ == "__main__":
    main()