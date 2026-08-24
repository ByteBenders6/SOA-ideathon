// ======================================================
// TOURSPhERE DESTINATION PAGE
// ======================================================

const API_BASE = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", loadDestination);


// ======================================================
// LOAD DESTINATION
// ======================================================

async function loadDestination() {

    const params = new URLSearchParams(window.location.search);
    const destinationId = params.get("id");

    if (!destinationId) {
        showError("No destination was selected.");
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/api/dashboard/${encodeURIComponent(destinationId)}`
        );

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const result = await response.json();

        console.log("Destination dashboard received:", result);

        if (!result.success || !result.data) {
            throw new Error("Invalid destination dashboard received.");
        }

        displayDestination(result.data);

    } catch (error) {

        console.error("Destination loading error:", error);

        showError(
            "Unable to load destination information."
        );
    }
}


// ======================================================
// DISPLAY DESTINATION
// ======================================================

function displayDestination(data) {

    const destination = data.destination || {};
    const recommendation = data.recommendation || {};
    const crowd = data.crowd || {};
    const road = data.road || {};
    const timing = data.timing || {};
    const weather = data.weather || {};
    const wikipedia = data.wikipedia || {};


    // ==================================================
    // BASIC DETAILS
    // ==================================================

    setText(
        "destinationName",
        destination.name || "Destination"
    );

    setText(
        "destinationState",
        destination.state || "India"
    );

    setText(
        "destinationDescription",
        destination.description ||
        "Discover this beautiful destination with TourSphere."
    );


    // ==================================================
    // QUICK INFORMATION
    // ==================================================

    setText(
        "destinationRating",
        recommendation.rating || "—"
    );

    setText(
        "destinationBudget",
        recommendation.budget || "—"
    );

    setText(
        "destinationSeason",
        recommendation.bestSeason || "—"
    );

    setText(
        "destinationCrowd",
        crowd.level || "—"
    );

    setText(
        "destinationTerrain",
        data.terrain || "—"
    );


    // ==================================================
    // WEATHER
    // ==================================================

    if (weather) {

        setHTML(
            "weatherContent",
            `
            <div class="detail-card">

                <h3>
                    ${escapeHtml(weather.temperature || "—")}
                </h3>

                <p>
                    ${escapeHtml(
                        weather.condition ||
                        "Weather information available."
                    )}
                </p>

                ${
                    weather.feelsLike
                        ? `<p>Feels like: ${escapeHtml(weather.feelsLike)}</p>`
                        : ""
                }

                ${
                    weather.humidity
                        ? `<p>Humidity: ${escapeHtml(weather.humidity)}</p>`
                        : ""
                }

                ${
                    weather.windSpeed
                        ? `<p>Wind: ${escapeHtml(weather.windSpeed)}</p>`
                        : ""
                }

                ${
                    weather.rain
                        ? `<p>Rain: ${escapeHtml(weather.rain)}</p>`
                        : ""
                }

            </div>
            `
        );

    } else {

        setHTML(
            "weatherContent",
            "<p>Weather information unavailable.</p>"
        );
    }


    // ==================================================
    // ABOUT
    // ==================================================

    setHTML(
        "aboutContent",
        `
        <div class="detail-card">

            <h3>
                ${escapeHtml(
                    wikipedia.title ||
                    destination.name ||
                    "About"
                )}
            </h3>

            <p>
                ${escapeHtml(
                    wikipedia.description ||
                    destination.description ||
                    "No additional information available."
                )}
            </p>

        </div>
        `
    );


    // ==================================================
    // TRAVEL INFORMATION
    // ==================================================

    setHTML(
        "travelContent",
        `
        <div class="detail-grid">

            <div class="detail-card">
                <h3>Road Type</h3>
                <p>${escapeHtml(road.type || "—")}</p>
            </div>

            <div class="detail-card">
                <h3>Road Condition</h3>
                <p>${escapeHtml(road.condition || "—")}</p>
            </div>

            <div class="detail-card">
                <h3>Vehicle</h3>
                <p>${escapeHtml(road.vehicle || "—")}</p>
            </div>

            <div class="detail-card">
                <h3>Traffic Warning</h3>
                <p>${escapeHtml(road.warning || "—")}</p>
            </div>

            <div class="detail-card">
                <h3>Opening Time</h3>
                <p>${escapeHtml(timing.opening || "—")}</p>
            </div>

            <div class="detail-card">
                <h3>Closing Time</h3>
                <p>${escapeHtml(timing.closing || "—")}</p>
            </div>

        </div>
        `
    );


    // ==================================================
    // NEARBY PLACES
    // ==================================================

    renderList(
        "nearbyContent",
        data.nearbyPlaces,
        "No nearby places available."
    );


    // ==================================================
    // HOTELS
    // ==================================================

    renderTextList(
        "hotelsContent",
        data.hotels?.join(", "),
        "No hotel information available."
    );


    // ==================================================
    // RESTAURANTS
    // ==================================================

    renderTextList(
        "restaurantsContent",
        data.restaurants?.join(", "),
        "No restaurant information available."
    );


    // ==================================================
    // HIDDEN GEMS
    // ==================================================

    renderList(
        "hiddenGemsContent",
        data.hiddenGems,
        "No hidden gems available."
    );


    // ==================================================
    // LIVE TRAVEL TOOLS
    // ==================================================

    setupTravelTools(data);
}


// ======================================================
// HELPER: SET TEXT
// ======================================================

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// ======================================================
// HELPER: SET HTML
// ======================================================

function setHTML(id, html) {

    const element = document.getElementById(id);

    if (element) {
        element.innerHTML = html;
    }
}


// ======================================================
// HELPER: ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char])
    );
}


// ======================================================
// RENDER OBJECT LIST
// ======================================================

function renderList(elementId, items, emptyMessage) {

    const container =
        document.getElementById(elementId);

    if (!container) {
        return;
    }

    if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
    ) {

        container.innerHTML = `
            <p>${escapeHtml(emptyMessage)}</p>
        `;

        return;
    }


    container.innerHTML = items.map(item => {

        if (typeof item === "string") {

            return `
                <div class="detail-card">
                    <p>${escapeHtml(item)}</p>
                </div>
            `;
        }


        return `
            <div class="detail-card">

                <h3>
                    ${escapeHtml(
                        item.name ||
                        item.title ||
                        "Place"
                    )}
                </h3>

                ${
                    item.description
                        ? `
                            <p>
                                ${escapeHtml(item.description)}
                            </p>
                          `
                        : ""
                }

                ${
                    item.rating
                        ? `
                            <p>
                                ⭐ ${escapeHtml(item.rating)}
                            </p>
                          `
                        : ""
                }

                ${
                    item.address
                        ? `
                            <p>
                                📍 ${escapeHtml(item.address)}
                            </p>
                          `
                        : ""
                }

            </div>
        `;

    }).join("");
}


// ======================================================
// RENDER TEXT LIST
// ======================================================

function renderTextList(
    elementId,
    text,
    emptyMessage
) {

    const container =
        document.getElementById(elementId);

    if (!container) {
        return;
    }

    if (!text) {

        container.innerHTML = `
            <p>${escapeHtml(emptyMessage)}</p>
        `;

        return;
    }


    const items = text
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);


    container.innerHTML = items.map(item => `
        <div class="detail-card">
            <p>${escapeHtml(item)}</p>
        </div>
    `).join("");
}


// ======================================================
// ERROR
// ======================================================

function showError(message) {

    const name =
        document.getElementById("destinationName");

    if (name) {
        name.textContent =
            "Unable to load destination";
    }


    const description =
        document.getElementById(
            "destinationDescription"
        );

    if (description) {
        description.textContent = message;
    }
}


// ======================================================
// DESTINATION LIVE TOOLS
// ======================================================

async function setupTravelTools(data) {

    const destination =
        data.destination || {};

    const destinationName =
        destination.name || "Destination";

    const description =
        destination.description || "";

    const encodedName =
        encodeURIComponent(destinationName);


    // ==================================================
    // ROUTE
    // ==================================================

    const routeLink =
        document.getElementById("routeLink");

    const routeSummary =
        document.getElementById("routeSummary");

    const route =
        data.route || {};


    // Your TourSphere Route API
    const routeApiURL =
        `${API_BASE}/api/route` +
        `?origin=Bhubaneswar` +
        `&destination=${encodedName}`;


    // Actual map that the user can open
    const routeMapURL =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=Bhubaneswar` +
        `&destination=${encodedName}`;


    if (routeSummary) {

        routeSummary.innerHTML = `
            <div>
                ${escapeHtml(
                    route.distance ||
                    "Distance unavailable"
                )}

                • 

                ${escapeHtml(
                    route.duration ||
                    "Travel time unavailable"
                )}
            </div>

            <div
                class="api-url"
                style="
                    font-size:0.75rem;
                    word-break:break-all;
                    margin-top:6px;
                    opacity:.7;
                "
            >
                API:
                ${escapeHtml(routeApiURL)}
            </div>
        `;
    }


    if (routeLink) {

        routeLink.href = routeMapURL;
        routeLink.target = "_blank";
        routeLink.rel =
            "noopener noreferrer";

        routeLink.textContent =
            "🗺️ Open Live Map →";
    }


    // ==================================================
    // NEARBY PLACES
    // ==================================================

    const nearbyLink =
        document.getElementById("nearbyLink");

    const nearbyContent =
        document.getElementById(
            "nearbyToolContent"
        );

    const places =
        Array.isArray(data.nearbyPlaces)
            ? data.nearbyPlaces
            : [];


    // Existing TourSphere Maps API
    const nearbyApiURL =
        `${API_BASE}/api/maps/nearby` +
        `?lat=20.0&lng=85.0`;


    // Actual destination-specific Google Maps
    const nearbyMapURL =
        `https://www.google.com/maps/search/?api=1` +
        `&query=${encodeURIComponent(
            "places near " + destinationName
        )}`;


    if (nearbyContent) {

        if (!places.length) {

            nearbyContent.innerHTML = `
                <p>
                    No nearby places available.
                </p>

                <div
                    class="api-url"
                    style="
                        font-size:0.75rem;
                        word-break:break-all;
                        opacity:.7;
                    "
                >
                    API:
                    ${escapeHtml(nearbyApiURL)}
                </div>
            `;

        } else {

            nearbyContent.innerHTML = `

                ${places.map(place => `

                    <div class="inline-place">

                        📍
                        ${escapeHtml(
                            place.name ||
                            "Nearby place"
                        )}

                        ${
                            place.rating
                                ? ` • ⭐ ${escapeHtml(place.rating)}`
                                : ""
                        }

                    </div>

                `).join("")}

                <div
                    class="api-url"
                    style="
                        font-size:0.75rem;
                        word-break:break-all;
                        margin-top:6px;
                        opacity:.7;
                    "
                >
                    API:
                    ${escapeHtml(nearbyApiURL)}
                </div>
            `;
        }
    }


    if (nearbyLink) {

        nearbyLink.href = nearbyMapURL;
        nearbyLink.target = "_blank";
        nearbyLink.rel =
            "noopener noreferrer";

        nearbyLink.textContent =
            "📍 Open Live Map →";
    }


    // ==================================================
    // HOTELS
    // ==================================================

    const hotelLink =
        document.getElementById("hotelLink");

    const hotelContent =
        document.getElementById(
            "hotelToolContent"
        );

    const hotels =
        Array.isArray(data.hotels)
            ? data.hotels
            : [];


    const hotelURL =
        `https://www.google.com/maps/search/?api=1` +
        `&query=${encodeURIComponent(
            "hotels near " + destinationName
        )}`;


    if (hotelContent) {

        hotelContent.innerHTML = `

            ${
                hotels.length

                    ? hotels.map(hotel => `
                        <div class="inline-place">
                            🏨
                            ${escapeHtml(hotel)}
                        </div>
                    `).join("")

                    : `
                        <p>
                            No hotel information available.
                        </p>
                    `
            }

            <div
                class="api-url"
                style="
                    font-size:0.75rem;
                    word-break:break-all;
                    margin-top:6px;
                    opacity:.7;
                "
            >
                MAP:
                ${escapeHtml(hotelURL)}
            </div>
        `;
    }


    if (hotelLink) {

        hotelLink.href = hotelURL;
        hotelLink.target = "_blank";
        hotelLink.rel =
            "noopener noreferrer";

        hotelLink.textContent =
            "🏨 Open Hotel Map →";
    }


    // ==================================================
    // RESTAURANTS
    // ==================================================

    const restaurantLink =
        document.getElementById(
            "restaurantLink"
        );

    const restaurantContent =
        document.getElementById(
            "restaurantToolContent"
        );

    const restaurants =
        Array.isArray(data.restaurants)
            ? data.restaurants
            : [];


    const restaurantURL =
        `https://www.google.com/maps/search/?api=1` +
        `&query=${encodeURIComponent(
            "restaurants near " +
            destinationName
        )}`;


    if (restaurantContent) {

        restaurantContent.innerHTML = `

            ${
                restaurants.length

                    ? restaurants.map(
                        restaurant => `
                            <div class="inline-place">
                                🍴
                                ${escapeHtml(
                                    restaurant
                                )}
                            </div>
                        `
                    ).join("")

                    : `
                        <p>
                            No restaurant
                            information available.
                        </p>
                    `
            }

            <div
                class="api-url"
                style="
                    font-size:0.75rem;
                    word-break:break-all;
                    margin-top:6px;
                    opacity:.7;
                "
            >
                MAP:
                ${escapeHtml(restaurantURL)}
            </div>
        `;
    }


    if (restaurantLink) {

        restaurantLink.href =
            restaurantURL;

        restaurantLink.target =
            "_blank";

        restaurantLink.rel =
            "noopener noreferrer";

        restaurantLink.textContent =
            "🍴 Open Restaurant Map →";
    }


    // ==================================================
    // HIDDEN GEMS
    // ==================================================

    const hiddenGemLink =
        document.getElementById(
            "hiddenGemLink"
        );

    const hiddenGemContent =
        document.getElementById(
            "hiddenGemToolContent"
        );

    const hiddenGems =
        Array.isArray(data.hiddenGems)
            ? data.hiddenGems
            : [];


    if (hiddenGemContent) {

        if (hiddenGems.length) {

            hiddenGemContent.innerHTML =
                hiddenGems.map(gem => `
                    <div class="inline-place">
                        💎
                        ${escapeHtml(
                            gem.name ||
                            "Hidden Gem"
                        )}
                    </div>
                `).join("");

        } else {

            hiddenGemContent.innerHTML =
                "<p>No hidden gems available.</p>";
        }
    }


    if (hiddenGemLink) {

        const gemName =
            hiddenGems.length
                ? (
                    hiddenGems[0].name ||
                    destinationName
                )
                : destinationName;


        const hiddenGemURL =
            `https://www.google.com/maps/search/?api=1` +
            `&query=${encodeURIComponent(
                gemName + " " + destinationName
            )}`;


        hiddenGemLink.href =
            hiddenGemURL;

        hiddenGemLink.target =
            "_blank";

        hiddenGemLink.rel =
            "noopener noreferrer";

        hiddenGemLink.textContent =
            "💎 Open Hidden Gem Map →";
    }


  // ======================================================
// WIKIPEDIA
// ======================================================

const wikipediaLink =
    document.getElementById("wikipediaLink");

if (wikipediaLink) {

    const wiki = data.wikipedia || {};

    console.log("Wikipedia information:", wiki);

    if (wiki.url) {

        wikipediaLink.href = wiki.url;

        wikipediaLink.target = "_blank";
        wikipediaLink.rel = "noopener noreferrer";

        wikipediaLink.textContent =
            "📖 Read More on Wikipedia →";

    } else {

        wikipediaLink.href = "#";

        wikipediaLink.textContent =
            "📖 Wikipedia unavailable";

        wikipediaLink.onclick = (event) => {
            event.preventDefault();
        };
    }
}
}