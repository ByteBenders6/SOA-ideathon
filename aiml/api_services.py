import os
import time
from urllib.parse import quote

import requests
from dotenv import load_dotenv


load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
WIKIPEDIA_URL = "https://en.wikipedia.org/api/rest_v1/page/summary/"

HEADERS = {
    "User-Agent": "SmartAITourismRecommendationSystem/1.0"
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)


def geocode_place(place_name, state=None):

    if not place_name:
        return {
            "success": False,
            "latitude": None,
            "longitude": None,
            "formatted_address": None,
            "error": "Place name is empty."
        }

    queries = []

    if state:
        queries.append(
            f"{place_name}, {state}, India"
        )

    queries.append(
        f"{place_name}, India"
    )

    if "beach" in str(place_name).lower():

        simple_name = (
            str(place_name)
            .replace(" Beach", "")
            .replace(" beach", "")
            .strip()
        )

        if state:
            queries.append(
                f"{simple_name}, {state}, India"
            )

    for query in queries:

        try:

            response = SESSION.get(
                NOMINATIM_URL,
                params={
                    "q": query,
                    "format": "json",
                    "limit": 1,
                    "countrycodes": "in"
                },
                timeout=8
            )

            response.raise_for_status()

            data = response.json()

            if data:

                result = data[0]

                return {
                    "success": True,
                    "latitude": float(result["lat"]),
                    "longitude": float(result["lon"]),
                    "formatted_address": result.get(
                        "display_name"
                    ),
                    "error": None
                }

        except Exception:
            pass

        time.sleep(1)

    return {
        "success": False,
        "latitude": None,
        "longitude": None,
        "formatted_address": None,
        "error": f"Could not find location for {place_name}."
    }


def get_live_weather(latitude, longitude):

    if not OPENWEATHER_API_KEY:

        return {
            "success": False,
            "data": None,
            "error": "OPENWEATHER_API_KEY is not configured."
        }

    try:

        response = SESSION.get(
            WEATHER_URL,
            params={
                "lat": latitude,
                "lon": longitude,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            },
            timeout=8
        )

        response.raise_for_status()

        data = response.json()

        main_data = data.get("main", {})
        weather_data = data.get("weather", [{}])[0]
        wind_data = data.get("wind", {})
        rain_data = data.get("rain", {})

        weather_info = {
            "location": data.get(
                "name",
                "Unknown"
            ),
            "temperature": main_data.get(
                "temp"
            ),
            "feels_like": main_data.get(
                "feels_like"
            ),
            "humidity": main_data.get(
                "humidity"
            ),
            "condition": weather_data.get(
                "main",
                "Unknown"
            ),
            "description": weather_data.get(
                "description",
                "Unknown"
            ),
            "rainfall": rain_data.get(
                "1h",
                0
            ),
            "wind_speed": wind_data.get(
                "speed",
                0
            )
        }

        return {
            "success": True,
            "data": weather_info,
            "error": None
        }

    except Exception as error:

        return {
            "success": False,
            "data": None,
            "error": str(error)
        }


def get_wikipedia_description(place_name):

    if not place_name:

        return {
            "success": False,
            "title": None,
            "description": None,
            "url": None,
            "error": "Place name is empty."
        }

    names = [
        str(place_name),
        str(place_name).replace(" Beach", ""),
        str(place_name).replace(" beach", "")
    ]

    checked_names = []

    for name in names:

        if name in checked_names:
            continue

        checked_names.append(name)

        encoded_name = quote(
            str(name).replace(" ", "_")
        )

        url = WIKIPEDIA_URL + encoded_name

        try:

            response = SESSION.get(
                url,
                timeout=8
            )

            if response.status_code == 404:
                continue

            response.raise_for_status()

            data = response.json()

            return {
                "success": True,
                "title": data.get(
                    "title",
                    place_name
                ),
                "description": data.get(
                    "extract",
                    "No description available."
                ),
                "url": data.get(
                    "content_urls",
                    {}
                ).get(
                    "desktop",
                    {}
                ).get(
                    "page"
                ),
                "error": None
            }

        except Exception:
            continue

    return {
        "success": False,
        "title": place_name,
        "description": None,
        "url": None,
        "error": "Wikipedia page not found."
    }


def get_nearby_facilities(
    latitude,
    longitude,
    radius=5000
):

    query = f"""
    [out:json][timeout:20];

    (
        nwr
        (around:{radius},{latitude},{longitude})
        ["amenity"~"police|hospital|clinic|fuel|restaurant|cafe|atm|marketplace"];

        nwr
        (around:{radius},{latitude},{longitude})
        ["tourism"~"hotel|guest_house"];

        nwr
        (around:{radius},{latitude},{longitude})
        ["shop"~"supermarket|mall|convenience|department_store"];
    );

    out center tags;
    """

    empty_result = {
        "police_station": [],
        "hospital": [],
        "petrol_pump": [],
        "hotel": [],
        "restaurant": [],
        "market": [],
        "atm": []
    }

    try:

        response = SESSION.post(
            OVERPASS_URL,
            data=query,
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        result = {
            key: []
            for key in empty_result
        }

        for element in data.get("elements", []):

            tags = element.get("tags", {})

            name = tags.get("name")

            if not name:
                continue

            if element.get("type") == "node":

                lat = element.get("lat")
                lon = element.get("lon")

            else:

                center = element.get(
                    "center",
                    {}
                )

                lat = center.get("lat")
                lon = center.get("lon")

            address_parts = []

            for key in [
                "addr:housenumber",
                "addr:street",
                "addr:city",
                "addr:state"
            ]:

                value = tags.get(key)

                if value:
                    address_parts.append(value)

            address = ", ".join(address_parts)

            maps_url = None

            if lat is not None and lon is not None:

                maps_url = (
                    "https://www.openstreetmap.org/"
                    f"?mlat={lat}&mlon={lon}"
                )

            place = {
                "name": name,
                "address": address,
                "latitude": lat,
                "longitude": lon,
                "maps_url": maps_url
            }

            amenity = tags.get(
                "amenity",
                ""
            ).lower()

            tourism = tags.get(
                "tourism",
                ""
            ).lower()

            shop = tags.get(
                "shop",
                ""
            ).lower()

            if amenity == "police":

                result["police_station"].append(place)

            elif amenity in [
                "hospital",
                "clinic"
            ]:

                result["hospital"].append(place)

            elif amenity == "fuel":

                result["petrol_pump"].append(place)

            elif tourism in [
                "hotel",
                "guest_house"
            ]:

                result["hotel"].append(place)

            elif amenity in [
                "restaurant",
                "cafe"
            ]:

                result["restaurant"].append(place)

            elif (
                amenity == "marketplace"
                or shop in [
                    "supermarket",
                    "mall",
                    "convenience",
                    "department_store"
                ]
            ):

                result["market"].append(place)

            elif amenity == "atm":

                result["atm"].append(place)

        for category in result:

            result[category] = result[category][:10]

        return {
            "success": True,
            "data": result,
            "errors": {}
        }

    except Exception as error:

        return {
            "success": False,
            "data": empty_result,
            "errors": {
                "overpass": str(error)
            }
        }


def get_place_api_data(
    place_name,
    state=None,
    radius=5000
):

    location = geocode_place(
        place_name,
        state
    )

    if not location.get("success"):

        return {
            "success": False,
            "place_name": place_name,
            "location": None,
            "weather": None,
            "wikipedia": None,
            "facilities": {
                "police_station": [],
                "hospital": [],
                "petrol_pump": [],
                "hotel": [],
                "restaurant": [],
                "market": [],
                "atm": []
            },
            "weather_error": None,
            "facilities_errors": {},
            "error": location.get("error")
        }

    latitude = location.get("latitude")
    longitude = location.get("longitude")

    weather_result = get_live_weather(
        latitude,
        longitude
    )

    wikipedia_result = get_wikipedia_description(
        place_name
    )

    facilities_result = get_nearby_facilities(
        latitude,
        longitude,
        radius
    )

    return {
        "success": True,
        "place_name": place_name,

        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "formatted_address": location.get(
                "formatted_address"
            )
        },

        "weather": weather_result.get(
            "data"
        ),

        "weather_error": weather_result.get(
            "error"
        ),

        "wikipedia": wikipedia_result,

        "facilities": facilities_result.get(
            "data",
            {}
        ),

        "facilities_errors": facilities_result.get(
            "errors",
            {}
        ),

        "error": None
    }