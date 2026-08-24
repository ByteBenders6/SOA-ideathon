import re
from datetime import datetime

import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

from api_services import get_place_api_data


TOURISM_FILE = "datasets/destinations_final.csv"
CROWD_FILE = "datasets/crowd_data_set_final.csv"


def load_data():
    tourism = pd.read_csv(TOURISM_FILE)
    crowd = pd.read_csv(CROWD_FILE)

    tourism.columns = (
        tourism.columns
        .str.strip()
        .str.lower()
    )

    crowd.columns = (
        crowd.columns
        .str.strip()
        .str.lower()
    )

    tourism = tourism.fillna("Unknown")
    crowd = crowd.fillna("Unknown")

    return tourism, crowd


def parse_rating(value):
    try:
        text = str(value).strip()

        match = re.search(
            r"(\d+(?:\.\d+)?)",
            text
        )

        if not match:
            return 0.0

        rating = float(match.group(1))

        if rating > 5:
            return 0.0

        return rating

    except Exception:
        return 0.0


class CrowdModel:

    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            class_weight="balanced"
        )

        self.destination_encoder = LabelEncoder()
        self.state_encoder = LabelEncoder()

        self.is_trained = False
        self.uses_state = False
        self.uses_month = False
        self.uses_day = False

    def train(self, crowd_data):

        data = crowd_data.copy()

        if "destination" not in data.columns:

            if "place_name" in data.columns:
                data["destination"] = data["place_name"]

            else:
                raise ValueError(
                    "Crowd dataset must contain "
                    "'destination' column."
                )

        if "crowd_level" not in data.columns:
            raise ValueError(
                "Crowd dataset is missing "
                "'crowd_level' column."
            )

        data["destination_encoded"] = (
            self.destination_encoder.fit_transform(
                data["destination"].astype(str)
            )
        )

        feature_columns = [
            "destination_encoded"
        ]

        if "state" in data.columns:

            data["state_encoded"] = (
                self.state_encoder.fit_transform(
                    data["state"].astype(str)
                )
            )

            feature_columns.append(
                "state_encoded"
            )

            self.uses_state = True

        if "month" in data.columns:

            data["month"] = pd.to_numeric(
                data["month"],
                errors="coerce"
            ).fillna(
                datetime.now().month
            )

            feature_columns.append("month")
            self.uses_month = True

        if "day_of_week" in data.columns:

            data["day_of_week"] = pd.to_numeric(
                data["day_of_week"],
                errors="coerce"
            ).fillna(
                datetime.now().weekday()
            )

            feature_columns.append(
                "day_of_week"
            )

            self.uses_day = True

        self.model.fit(
            data[feature_columns],
            data["crowd_level"].astype(str)
        )

        self.feature_columns = feature_columns
        self.is_trained = True

    def predict(
        self,
        state,
        destination,
        month,
        day_of_week
    ):

        if not self.is_trained:
            return "Moderate"

        try:

            destination = str(destination)

            if destination not in (
                self.destination_encoder.classes_
            ):
                return "Moderate"

            values = {
                "destination_encoded": [
                    self.destination_encoder.transform(
                        [destination]
                    )[0]
                ]
            }

            if self.uses_state:

                state = str(state)

                if state in (
                    self.state_encoder.classes_
                ):

                    state_value = (
                        self.state_encoder.transform(
                            [state]
                        )[0]
                    )

                else:
                    state_value = 0

                values["state_encoded"] = [
                    state_value
                ]

            if self.uses_month:
                values["month"] = [month]

            if self.uses_day:
                values["day_of_week"] = [
                    day_of_week
                ]

            dataframe = pd.DataFrame(values)

            return str(
                self.model.predict(
                    dataframe
                )[0]
            )

        except Exception:
            return "Moderate"


def group_score(
    category,
    user_group
):

    category = str(category).lower()
    user_group = str(user_group).lower()

    groups = {

        "family": [
            "family",
            "nature",
            "park",
            "beach",
            "heritage",
            "temple"
        ],

        "couple": [
            "romantic",
            "beach",
            "nature",
            "hill",
            "lake",
            "waterfall"
        ],

        "friends": [
            "adventure",
            "beach",
            "waterfall",
            "hill",
            "trek",
            "nature"
        ],

        "solo": [
            "nature",
            "heritage",
            "culture",
            "temple",
            "beach"
        ]
    }

    for group, categories in groups.items():

        if group in user_group:

            if any(
                word in category
                for word in categories
            ):
                return 20

            return 10

    return 10


def budget_score(
    destination_budget,
    user_budget
):

    try:

        text = str(
            destination_budget
        ).lower()

        numbers = []

        for value in re.findall(
            r"\d+(?:,\d+)*(?:\.\d+)?",
            text
        ):

            numbers.append(
                float(
                    value.replace(",", "")
                )
            )

        if not numbers:
            return 0

        destination_cost = max(numbers)

        user_budget = float(user_budget)

        if destination_cost <= user_budget:

            difference = (
                user_budget
                - destination_cost
            )

            if difference >= (
                user_budget * 0.30
            ):
                return 20

            return 15

        return 0

    except Exception:
        return 0


def hidden_gem_score(
    hidden_gem
):

    value = str(
        hidden_gem
    ).lower().strip()

    invalid = [
        "unknown",
        "none",
        "no",
        "nan",
        "",
        "n/a"
    ]

    if value in invalid:
        return 0

    return 10


def crowd_risk(
    crowd_level
):

    value = str(
        crowd_level
    ).lower()

    if "very high" in value:
        return 40

    if "high" in value:
        return 30

    if (
        "moderate" in value
        or
        "medium" in value
    ):
        return 15

    return 5


def road_risk(
    destination
):

    risk = 0

    terrain = str(
        destination.get(
            "terrain_type",
            ""
        )
    ).lower()

    road = str(
        destination.get(
            "road_condition",
            ""
        )
    ).lower()

    vehicle = str(
        destination.get(
            "vehicle_suitability",
            ""
        )
    ).lower()

    if "mountain" in terrain:
        risk += 20

    elif "hilly" in terrain:
        risk += 15

    if "poor" in road:
        risk += 25

    elif (
        "average" in road
        or
        "fair" in road
    ):
        risk += 10

    if "not suitable" in vehicle:
        risk += 20

    return risk


def weather_risk(
    weather_data
):

    if not weather_data:
        return 0

    risk = 0

    condition = str(
        weather_data.get(
            "condition",
            ""
        )
    ).lower()

    description = str(
        weather_data.get(
            "description",
            ""
        )
    ).lower()

    rainfall = weather_data.get(
        "rainfall",
        0
    )

    combined = (
        condition
        + " "
        + description
    )

    if "storm" in combined:
        risk += 40

    elif "heavy rain" in combined:
        risk += 35

    elif "thunder" in combined:
        risk += 30

    elif "rain" in combined:
        risk += 15

    try:

        rainfall = float(rainfall)

        if rainfall > 50:
            risk += 30

        elif rainfall > 20:
            risk += 15

    except Exception:
        pass

    return min(
        risk,
        60
    )


def calculate_travel_risk(
    destination,
    predicted_crowd,
    weather_data=None
):

    total = (
        crowd_risk(
            predicted_crowd
        )
        +
        road_risk(
            destination
        )
        +
        weather_risk(
            weather_data
        )
    )

    total = min(
        int(total),
        100
    )

    if total <= 30:
        level = "Low"

    elif total <= 60:
        level = "Moderate"

    else:
        level = "High"

    return {
        "score": total,
        "level": level
    }


def calculate_local_score(
    destination,
    budget,
    group_type
):

    budget_value = budget_score(
        destination[
            "estimate_budget"
        ],
        budget
    )

    group_value = group_score(
        destination[
            "category"
        ],
        group_type
    )

    hidden_value = hidden_gem_score(
        destination[
            "hidden_gem"
        ]
    )

    rating = parse_rating(
        destination[
            "rating"
        ]
    )

    rating_score = min(
        rating * 4,
        20
    )

    is_popular = str(
        destination[
            "is_popular"
        ]
    ).lower()

    popularity_bonus = 0

    if is_popular in [
        "false",
        "no",
        "0"
    ]:
        popularity_bonus = 5

    return (
        budget_value
        +
        group_value
        +
        hidden_value
        +
        rating_score
        +
        popularity_bonus
    )


def process_destination_api(
    destination,
    state,
    crowd,
    budget,
    group_type
):

    place_name = str(
        destination[
            "place_name"
        ]
    )

    try:

        api_data = get_place_api_data(
            place_name,
            state,
            radius=5000
        )

    except Exception as error:

        api_data = {
            "success": False,
            "weather": None,
            "wikipedia": None,
            "facilities": {},
            "location": None,
            "weather_error": str(error),
            "facilities_errors": {}
        }

    weather = api_data.get(
        "weather"
    )

    risk = calculate_travel_risk(
        destination,
        crowd,
        weather
    )

    risk_penalty = (
        risk["score"] * 0.20
    )

    base_score = calculate_local_score(
        destination,
        budget,
        group_type
    )

    final_score = (
        base_score
        - risk_penalty
    )

    rating = parse_rating(
        destination[
            "rating"
        ]
    )

    return {
        "place_name": place_name,

        "state": destination[
            "state"
        ],

        "category": destination[
            "category"
        ],

        "hidden_gem": destination[
            "hidden_gem"
        ],

        "estimated_budget": destination[
            "estimate_budget"
        ],

        "best_time_to_visit": destination[
            "best_time_to_visit"
        ],

        "distance": destination[
            "distance"
        ],

        "description": destination[
            "description"
        ],

        "crowd_prediction": crowd,

        "ai_travel_index": risk,

        "live_weather": weather,

        "weather_error": api_data.get(
            "weather_error"
        ),

        "wikipedia": api_data.get(
            "wikipedia"
        ),

        "facilities": api_data.get(
            "facilities",
            {}
        ),

        "facilities_errors": api_data.get(
            "facilities_errors",
            {}
        ),

        "location": api_data.get(
            "location"
        ),

        "terrain_type": destination[
            "terrain_type"
        ],

        "road_type": destination[
            "road_type"
        ],

        "road_condition": destination[
            "road_condition"
        ],

        "vehicle_suitability": destination[
            "vehicle_suitability"
        ],

        "traffic_warning": destination[
            "traffic_warning"
        ],

        "opening_time": destination[
            "opening_time"
        ],

        "closing_time": destination[
            "closing_time"
        ],

        "nearby_hotels": destination[
            "nearby_hotels"
        ],

        "nearby_restaurants": destination[
            "nearby_restaurants"
        ],

        "rating": rating,

        "recommendation_score": round(
            final_score,
            2
        )
    }


def recommend_destinations(
    state,
    budget,
    group_type,
    duration,
    weather_data=None
):

    tourism, crowd_data = load_data()

    required_columns = [
        "place_name",
        "state",
        "category",
        "is_popular",
        "hidden_gem",
        "distance",
        "description",
        "estimate_budget",
        "rating",
        "best_time_to_visit",
        "crowd_level",
        "peak_months",
        "terrain_type",
        "opening_time",
        "closing_time",
        "road_type",
        "road_condition",
        "vehicle_suitability",
        "traffic_warning",
        "nearby_hotels",
        "nearby_restaurants"
    ]

    missing = [
        column
        for column in required_columns
        if column not in tourism.columns
    ]

    if missing:
        raise ValueError(
            "Tourism dataset is missing columns: "
            +
            ", ".join(missing)
        )

    crowd_model = CrowdModel()

    crowd_model.train(
        crowd_data
    )

    state_data = tourism[
        tourism[
            "state"
        ]
        .astype(str)
        .str.strip()
        .str.lower()
        ==
        str(state)
        .strip()
        .lower()
    ].copy()

    if state_data.empty:
        return []

    now = datetime.now()

    month = now.month
    day = now.weekday()

    candidates = []

    for _, destination in (
        state_data.iterrows()
    ):

        place_name = str(
            destination[
                "place_name"
            ]
        )

        crowd = crowd_model.predict(
            state,
            place_name,
            month,
            day
        )

        score = calculate_local_score(
            destination,
            budget,
            group_type
        )

        score -= (
            crowd_risk(
                crowd
            )
            * 0.20
        )

        candidates.append({
            "destination":
                destination,
            "crowd":
                crowd,
            "score":
                score
        })

    candidates.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    top_candidates = candidates[:3]

    recommendations = []

    for candidate in top_candidates:

        result = process_destination_api(
            candidate[
                "destination"
            ],
            state,
            candidate[
                "crowd"
            ],
            budget,
            group_type
        )

        recommendations.append(
            result
        )

    recommendations.sort(
        key=lambda x:
            x[
                "recommendation_score"
            ],
        reverse=True
    )

    return recommendations


def smart_destination_switching(
    recommendations
):

    if not recommendations:

        return {
            "selected": None,
            "alternative": None,
            "reason":
                "No destination found."
        }

    best = recommendations[0]

    if (
        best[
            "ai_travel_index"
        ][
            "level"
        ]
        == "High"
        or
        best[
            "crowd_prediction"
        ]
        in [
            "High",
            "Very High"
        ]
    ):

        for alternative in (
            recommendations[1:]
        ):

            if (
                alternative[
                    "ai_travel_index"
                ][
                    "level"
                ]
                != "High"
                and
                alternative[
                    "crowd_prediction"
                ]
                not in [
                    "High",
                    "Very High"
                ]
            ):

                return {
                    "selected":
                        alternative,

                    "alternative":
                        best,

                    "reason":
                        (
                            "Destination switched because "
                            "the original destination has "
                            "higher travel risk or crowd level."
                        )
                }

    return {
        "selected": best,
        "alternative": None,
        "reason":
            (
                "Recommended destination satisfies "
                "current suitability conditions."
            )
    }


def run_recommendation_system(
    state,
    budget,
    group_type,
    duration,
    weather_data=None
):

    recommendations = (
        recommend_destinations(
            state=state,
            budget=budget,
            group_type=group_type,
            duration=duration,
            weather_data=weather_data
        )
    )

    switching = (
        smart_destination_switching(
            recommendations
        )
    )

    return {
        "input": {
            "state": state,
            "budget": budget,
            "group_type": group_type,
            "duration": duration
        },

        "recommendations":
            recommendations,

        "smart_destination_switching":
            switching
    }


if __name__ == "__main__":

    result = run_recommendation_system(
        state="Odisha",
        budget=6000,
        group_type="Family",
        duration=2
    )

    print(
        "=" * 60
    )

    print(
        "SMART AI TOURISM RECOMMENDATION SYSTEM"
    )

    print(
        "=" * 60
    )

    print("\nINPUT")

    print(
        result["input"]
    )

    print(
        "\nRECOMMENDED DESTINATIONS"
    )

    for destination in (
        result[
            "recommendations"
        ]
    ):

        print(
            "\n" + "-" * 40
        )

        print(
            "Place:",
            destination[
                "place_name"
            ]
        )

        print(
            "State:",
            destination[
                "state"
            ]
        )

        print(
            "Category:",
            destination[
                "category"
            ]
        )

        print(
            "Hidden Gem:",
            destination[
                "hidden_gem"
            ]
        )

        print(
            "Estimated Budget:",
            destination[
                "estimated_budget"
            ]
        )

        print(
            "Best Time:",
            destination[
                "best_time_to_visit"
            ]
        )

        print(
            "Distance:",
            destination[
                "distance"
            ]
        )

        print(
            "Description:",
            destination[
                "description"
            ]
        )

        print(
            "Crowd Prediction:",
            destination[
                "crowd_prediction"
            ]
        )

        print(
            "AI Travel Risk:",
            destination[
                "ai_travel_index"
            ]
        )

        print(
            "Terrain:",
            destination[
                "terrain_type"
            ]
        )

        print(
            "Road Type:",
            destination[
                "road_type"
            ]
        )

        print(
            "Road Condition:",
            destination[
                "road_condition"
            ]
        )

        print(
            "Vehicle Suitability:",
            destination[
                "vehicle_suitability"
            ]
        )

        print(
            "Traffic Warning:",
            destination[
                "traffic_warning"
            ]
        )

        print(
            "Opening Time:",
            destination[
                "opening_time"
            ]
        )

        print(
            "Closing Time:",
            destination[
                "closing_time"
            ]
        )

        print(
            "Nearby Hotels:",
            destination[
                "nearby_hotels"
            ]
        )

        print(
            "Nearby Restaurants:",
            destination[
                "nearby_restaurants"
            ]
        )

        print(
            "Rating:",
            destination[
                "rating"
            ]
        )

        print(
            "Recommendation Score:",
            destination[
                "recommendation_score"
            ]
        )

        print(
            "\nLOCATION"
        )

        location = destination.get(
            "location"
        )

        if location:

            print(
                "Address:",
                location.get(
                    "formatted_address",
                    "Unknown"
                )
            )

        else:

            print(
                "Location unavailable."
            )

        print(
            "\nLIVE WEATHER"
        )

        weather = destination.get(
            "live_weather"
        )

        if weather:

            print(
                "Location:",
                weather.get(
                    "location",
                    "Unknown"
                )
            )

            print(
                "Temperature:",
                weather.get(
                    "temperature",
                    "Unknown"
                ),
                "°C"
            )

            print(
                "Feels Like:",
                weather.get(
                    "feels_like",
                    "Unknown"
                ),
                "°C"
            )

            print(
                "Humidity:",
                weather.get(
                    "humidity",
                    "Unknown"
                ),
                "%"
            )

            print(
                "Condition:",
                weather.get(
                    "condition",
                    "Unknown"
                )
            )

            print(
                "Description:",
                weather.get(
                    "description",
                    "Unknown"
                )
            )

            print(
                "Rainfall:",
                weather.get(
                    "rainfall",
                    0
                ),
                "mm"
            )

            print(
                "Wind Speed:",
                weather.get(
                    "wind_speed",
                    0
                ),
                "m/s"
            )

        else:

            print(
                "Live weather unavailable."
            )

            if destination.get(
                "weather_error"
            ):

                print(
                    "Weather Error:",
                    destination[
                        "weather_error"
                    ]
                )

        print(
            "\nWIKIPEDIA"
        )

        wiki = destination.get(
            "wikipedia"
        )

        if (
            wiki
            and
            wiki.get(
                "success"
            )
        ):

            print(
                "Title:",
                wiki.get(
                    "title"
                )
            )

            print(
                "Description:",
                wiki.get(
                    "description"
                )
            )

            if wiki.get(
                "url"
            ):

                print(
                    "Wikipedia URL:",
                    wiki.get(
                        "url"
                    )
                )

        else:

            print(
                "Wikipedia data unavailable."
            )

        print(
            "\nNEARBY FACILITIES"
        )

        facilities = destination.get(
            "facilities",
            {}
        )

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

        for key, title in (
            facility_names.items()
        ):

            places = facilities.get(
                key,
                []
            )

            print(
                f"\n{title}:"
            )

            if places:

                for place in places:

                    print(
                        "  -",
                        place.get(
                            "name",
                            "Unnamed"
                        )
                    )

                    if place.get(
                        "address"
                    ):

                        print(
                            "    Address:",
                            place.get(
                                "address"
                            )
                        )

                    if place.get(
                        "maps_url"
                    ):

                        print(
                            "    Map:",
                            place.get(
                                "maps_url"
                            )
                        )

            else:

                print(
                    "  No places found."
                )

    print(
        "\n" + "=" * 60
    )

    print(
        "SMART DESTINATION SWITCHING"
    )

    print(
        "=" * 60
    )

    switching = result[
        "smart_destination_switching"
    ]

    if switching[
        "selected"
    ]:

        print(
            "\nSelected Destination:",
            switching[
                "selected"
            ][
                "place_name"
            ]
        )

    else:

        print(
            "\nNo destination selected."
        )

    if switching.get(
        "alternative"
    ):

        print(
            "Original Destination:",
            switching[
                "alternative"
            ][
                "place_name"
            ]
        )

    print(
        "Reason:",
        switching[
            "reason"
        ]
    )