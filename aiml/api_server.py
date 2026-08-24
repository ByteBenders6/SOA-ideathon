from flask import Flask, request, jsonify
from flask_cors import CORS

from query_parser import parse_user_query
from recommendation_engine import run_recommendation_system

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return jsonify({
        "status": "OK",
        "service": "TourSphere AIML"
    })


@app.post("/api/recommend")
def recommend():
    data = request.get_json(silent=True) or {}
    query = str(data.get("query") or "").strip()

    if not query:
        return jsonify({
            "success": False,
            "error": "Query is required"
        }), 400

    parsed = parse_user_query(query)

    # Keep sensible defaults when the user's sentence omits a field.
    state = parsed.get("state") or "Odisha"
    budget = parsed.get("budget") or 15000
    group_type = parsed.get("group_type") or "Solo"
    duration = parsed.get("duration") or 5

    result = run_recommendation_system(
        state=state,
        budget=budget,
        group_type=group_type,
        duration=duration
    )

    result["recommendations"] = (result.get("recommendations") or [])[:3]
    result["parsed_query"] = parsed
    result["success"] = True

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8001, debug=False)
