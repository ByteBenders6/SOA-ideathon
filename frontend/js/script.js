const navbar = document.querySelector(".custom-navbar");
const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;

    hero.style.opacity = 1 - scrollY / 800;
    if(scrollY > 80){

    navbar.classList.add("scrolled");

}else{
    navbar.classList.remove("scrolled");

}

});
const hiddenGems = document.querySelector(".hidden-gems");

window.addEventListener("scroll", () => {
    const sectionTop = hiddenGems.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight - 100) {
        hiddenGems.classList.add("show");
    } else {
        hiddenGems.classList.remove("show");
    }
});
const heroSection = document.getElementById("hero");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    heroSection.style.backgroundPosition = `center ${scrollY * 0.35}px`;
});
// ================= AI TRAVEL CONCIERGE =================

// ---------------------------------------------------------
// Existing TourSphere elements
// ---------------------------------------------------------

const tripInput =
    document.getElementById("tripInput");

const generateBtn =
    document.querySelector(".generate-btn");

const tripResult =
    document.getElementById("tripResult");

const aiResult =
    document.querySelector(".ai-result");

const aiLoading =
    document.querySelector(".ai-loading");

const aiRecommendation =
    aiResult
        ? aiResult.querySelector("h3")
        : null;


// ---------------------------------------------------------
// TourSphere backend
// ---------------------------------------------------------

const TOURSPHERE_API =
    "http://localhost:8000";


// =========================================================
// CURATED 1–10 DAY ITINERARIES
// =========================================================

const TOURSPHERE_ITINERARIES = {

    "Puri": [

        [
            "Jagannath Temple",
            "Puri Beach"
        ],

        [
            "Puri Beach",
            "Local market"
        ],

        [
            "Konark Sun Temple",
            "Chandrabhaga Beach"
        ],

        [
            "Balighai Beach",
            "Beleswar Beach"
        ],

        [
            "Baliharchandi Beach",
            "Puri Beach"
        ],

        [
            "Konark",
            "Kuruma Buddhist site"
        ],

        [
            "Jagannath Temple",
            "Local food experience"
        ],

        [
            "Puri",
            "Balighai Beach"
        ],

        [
            "Konark",
            "Chandrabhaga Beach"
        ],

        [
            "Puri Beach",
            "Relaxed departure"
        ]

    ],


    "Konark": [

        [
            "Konark Sun Temple",
            "Konark Museum"
        ],

        [
            "Chandrabhaga Beach",
            "Sunset"
        ],

        [
            "Puri Beach",
            "Jagannath Temple"
        ],

        [
            "Kuruma Buddhist site",
            "Konark"
        ],

        [
            "Chandrabhaga Beach",
            "Local exploration"
        ],

        [
            "Puri",
            "Konark"
        ],

        [
            "Balighai Beach",
            "Puri"
        ],

        [
            "Baliharchandi Beach",
            "Coastal drive"
        ],

        [
            "Konark",
            "Chandrabhaga Beach"
        ],

        [
            "Relaxed Konark departure"
        ]

    ],


    "Balighai Beach": [

        [
            "Balighai Beach",
            "Beleswar Beach"
        ],

        [
            "Puri Beach",
            "Jagannath Temple"
        ],

        [
            "Konark",
            "Chandrabhaga Beach"
        ],

        [
            "Balighai Beach",
            "Puri"
        ],

        [
            "Beleswar Beach",
            "Baliharchandi Beach"
        ],

        [
            "Puri Beach",
            "Local market"
        ],

        [
            "Konark",
            "Balighai Beach"
        ],

        [
            "Baliharchandi Beach",
            "Coastal drive"
        ],

        [
            "Puri",
            "Beleswar Beach"
        ],

        [
            "Relaxed beach day"
        ]

    ],


    "Shillong": [

        [
            "Shillong city",
            "Police Bazar"
        ],

        [
            "Ward's Lake",
            "Local cafés"
        ],

        [
            "Mawphlang Sacred Forest"
        ],

        [
            "Laitlum Canyon",
            "Shillong"
        ],

        [
            "Sohra",
            "Waterfalls"
        ],

        [
            "Living root bridge area"
        ],

        [
            "Mawphlang",
            "Shillong"
        ],

        [
            "Sohra",
            "Waterfalls"
        ],

        [
            "Laitlum Canyon",
            "Shillong"
        ],

        [
            "Relaxed Shillong day"
        ]

    ],


    "Sohra": [

        [
            "Sohra",
            "Nearby waterfalls"
        ],

        [
            "Limestone caves",
            "Sohra"
        ],

        [
            "Living root bridge area"
        ],

        [
            "Waterfalls",
            "Sohra"
        ],

        [
            "Wei SawDong Falls"
        ],

        [
            "Shillong",
            "Sohra"
        ],

        [
            "Mawphlang",
            "Sohra"
        ],

        [
            "Laitlum Canyon",
            "Sohra"
        ],

        [
            "Waterfalls",
            "Shillong"
        ],

        [
            "Relaxed Sohra day"
        ]

    ],


    "Laitlum Canyon": [

        [
            "Laitlum Canyon"
        ],

        [
            "Shillong",
            "Police Bazar"
        ],

        [
            "Mawphlang Sacred Forest"
        ],

        [
            "Shillong",
            "Laitlum Canyon"
        ],

        [
            "Sohra",
            "Waterfalls"
        ],

        [
            "Mawphlang",
            "Shillong"
        ],

        [
            "Sohra",
            "Laitlum Canyon"
        ],

        [
            "Shillong",
            "Local cafés"
        ],

        [
            "Mawphlang",
            "Laitlum Canyon"
        ],

        [
            "Relaxed hill day"
        ]

    ],


    "Shimla": [

        [
            "Shimla",
            "Mall Road",
            "The Ridge"
        ],

        [
            "The Ridge",
            "Local cafés"
        ],

        [
            "Cheog"
        ],

        [
            "Nearby viewpoints",
            "Shimla"
        ],

        [
            "Mashobra",
            "Shimla"
        ],

        [
            "Cheog",
            "Local villages"
        ],

        [
            "Mall Road",
            "The Ridge"
        ],

        [
            "Mashobra",
            "Cheog"
        ],

        [
            "Shimla",
            "Nearby viewpoints"
        ],

        [
            "Relaxed Shimla day"
        ]

    ],


    "Mashobra": [

        [
            "Mashobra",
            "Forest trails"
        ],

        [
            "Shimla",
            "The Ridge"
        ],

        [
            "Shali Tibba"
        ],

        [
            "Forest trails",
            "Mashobra"
        ],

        [
            "Cheog",
            "Mashobra"
        ],

        [
            "Shali Tibba",
            "Local villages"
        ],

        [
            "Shimla",
            "Mashobra"
        ],

        [
            "Cheog",
            "Shali Tibba"
        ],

        [
            "Mashobra",
            "Forest trails"
        ],

        [
            "Relaxed mountain day"
        ]

    ],


    "Chichoga": [

        [
            "Chichoga",
            "Manali surroundings"
        ],

        [
            "Manali"
        ],

        [
            "Jogini Waterfall"
        ],

        [
            "Mountain viewpoints"
        ],

        [
            "Chichoga",
            "Nearby villages"
        ],

        [
            "Manali",
            "Jogini Waterfall"
        ],

        [
            "Nearby villages",
            "Mountain views"
        ],

        [
            "Chichoga",
            "Manali"
        ],

        [
            "Jogini Waterfall",
            "Manali"
        ],

        [
            "Relaxed mountain day"
        ]

    ]

};


// =========================================================
// HELPERS
// =========================================================

function normaliseTripText(text) {

    return String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// ---------------------------------------------------------
// Detect number of days
// ---------------------------------------------------------

function getTripDays(text) {

    const value =
        normaliseTripText(text);


    const dayMatch =
        value.match(
            /(\d{1,2})\s*(?:day|days|d)\b/
        );


    if (dayMatch) {

        const days =
            Number(dayMatch[1]);


        return Math.min(
            10,
            Math.max(1, days)
        );

    }


    const weekMatch =
        value.match(
            /(\d+)\s*week/
        );


    if (weekMatch) {

        return Math.min(
            10,
            Math.max(
                1,
                Number(weekMatch[1]) * 7
            )
        );

    }


    // Default itinerary
    return 5;

}


// ---------------------------------------------------------
// Detect travel type
// ---------------------------------------------------------

function getTripType(text) {

    const value =
        normaliseTripText(text);


    if (
        value.includes("family") ||
        value.includes("kids") ||
        value.includes("children")
    ) {

        return "👨‍👩‍👧 Family";

    }


    if (
        value.includes("friends") ||
        value.includes("friend") ||
        value.includes("group")
    ) {

        return "👥 Friends";

    }


    if (
        value.includes("couple") ||
        value.includes("romantic") ||
        value.includes("honeymoon")
    ) {

        return "❤️ Couple";

    }


    if (
        value.includes("solo") ||
        value.includes("alone")
    ) {

        return "👤 Solo";

    }


    return "🌍 General";

}


// ---------------------------------------------------------
// Detect budget
// ---------------------------------------------------------

function getTripBudget(
    text,
    destination
) {

    const value =
        normaliseTripText(text);


    if (
        value.includes("under 10k") ||
        value.includes("under 10000") ||
        value.includes("10k")
    ) {

        return "Under ₹10,000";

    }


    if (
        value.includes("10k 25k") ||
        value.includes("10k to 25k") ||
        value.includes("10000 25000")
    ) {

        return "₹10,000 – ₹25,000";

    }


    if (
        value.includes("25k") ||
        value.includes("25000") ||
        value.includes("luxury")
    ) {

        return "₹25,000+";

    }


    return (
        destination?.estimate_budget ||
        "Budget not specified"
    );

}


// =========================================================
// FIND DESTINATION
// =========================================================

function findTripDestination(
    destinations,
    query
) {

    const text =
        normaliseTripText(query);


    let bestDestination =
        null;

    let bestScore =
        0;


    destinations.forEach(
        destination => {

            const name =
                normaliseTripText(
                    destination.place_name
                );

            const state =
                normaliseTripText(
                    destination.state
                );

            const category =
                normaliseTripText(
                    destination.category
                );


            let score = 0;


            // Exact destination name
            if (
                name &&
                text.includes(name)
            ) {

                score += 100;

            }


            // Individual words
            const words =
                text
                    .split(" ")
                    .filter(
                        word =>
                            word.length >= 3
                    );


            words.forEach(
                word => {

                    if (
                        name.includes(word)
                    ) {

                        score += 30;

                    }


                    if (
                        state.includes(word)
                    ) {

                        score += 10;

                    }


                    if (
                        category.includes(word)
                    ) {

                        score += 5;

                    }

                }
            );


            if (
                score >
                bestScore
            ) {

                bestScore =
                    score;

                bestDestination =
                    destination;

            }

        }
    );


    return {
        destination:
            bestDestination,

        score:
            bestScore

    };

}


// =========================================================
// GET DAY-WISE ITINERARY
// =========================================================

function buildTripItinerary(
    destination,
    days
) {

    const destinationName =
        destination?.place_name;


    let itinerary =
        TOURSPHERE_ITINERARIES[
            destinationName
        ];


    // If destination has no custom itinerary
    // create a safe fallback.
    if (!itinerary) {

        itinerary = [];


        for (
            let i = 0;
            i < 10;
            i++
        ) {

            itinerary.push([
                destinationName ||
                "Explore the destination"
            ]);

        }

    }


    return itinerary.slice(
        0,
        days
    );

}


// =========================================================
// DAY-WISE TIP
// =========================================================

function getDayTip(day) {

    if (day === 1) {

        return "Start easy, explore the main attraction and get familiar with the destination.";

    }


    if (day === 2) {

        return "Mix sightseeing with some time for local food and relaxation.";

    }


    if (day === 3) {

        return "Keep enough travel time between attractions and avoid rushing.";

    }


    if (day === 4) {

        return "Use today for a quieter attraction or hidden gem.";

    }


    if (day === 5) {

        return "Keep the day flexible and enjoy the destination at a relaxed pace.";

    }


    if (day <= 8) {

        return "Balance sightseeing with rest so the trip stays comfortable.";

    }


    if (day === 9) {

        return "Use today for any remaining must-see places.";

    }


    return "Keep the final day relaxed and leave enough time for departure.";

}


// =========================================================
// CREATE AI RESULT HTML
// =========================================================

function createTripResult(
    destination,
    days,
    travelType,
    budget
) {

    const name =
        destination?.place_name ||
        "Your Destination";


    const itinerary =
        buildTripItinerary(
            destination,
            days
        );


    let html = `

        <div class="ts-concierge-card">

            <div class="ts-concierge-heading">

                <span>
                    ✨ YOUR PERSONALIZED ADVENTURE
                </span>

                <h2>
                    📍 ${escapeTripHtml(name)}
                </h2>

                <div class="ts-trip-meta">

                    <span>
                        ${escapeTripHtml(
                            travelType
                        )}
                    </span>

                    <span>
                        📅 ${days}
                        Day${days === 1 ? "" : "s"}
                    </span>

                    <span>
                        💰 ${escapeTripHtml(
                            budget
                        )}
                    </span>

                </div>

            </div>


            <div class="ts-day-list">
    `;


    itinerary.forEach(
        (places, index) => {

            const day =
                index + 1;


            let title =
                "🗺️ EXPLORE & DISCOVER";


            if (day === 1) {

                title =
                    "🌅 START YOUR JOURNEY";

            } else if (
                day === days
            ) {

                title =
                    "✨ FINAL DAY";

            }


            html += `

                <article
                    class="ts-day-card"
                >

                    <div
                        class="ts-day-number"
                    >
                        DAY ${day}
                    </div>


                    <div
                        class="ts-day-content"
                    >

                        <h3>
                            ${title}
                        </h3>


                        <ul>

                            ${places.map(
                                place => `
                                    <li>
                                        ${escapeTripHtml(
                                            place
                                        )}
                                    </li>
                                `
                            ).join("")}

                        </ul>


                        <p
                            class="ts-day-tip"
                        >
                            💡 ${escapeTripHtml(
                                getDayTip(day)
                            )}
                        </p>

                    </div>

                </article>

            `;

        }
    );


    html += `

            </div>


            <div
                class="ts-concierge-tip"
            >

                <strong>
                    💡 TOURSPHERE TIP
                </strong>

                <p>

                    ${
                        destination?.best_time_to_visit
                            ? `Best time to visit: ${
                                escapeTripHtml(
                                    destination.best_time_to_visit
                                )
                            }. `
                            : ""
                    }

                    ${
                        destination?.traffic_warning
                            ? escapeTripHtml(
                                destination.traffic_warning
                            )
                            : "Check local weather and road conditions before travelling."
                    }

                </p>

            </div>


            ${
                destination?.id
                    ? `

                        <a
                            href="destination.html?id=${encodeURIComponent(
                                destination.id
                            )}"
                            class="ts-full-destination-btn"
                        >
                            🗺️ Explore Full Destination →
                        </a>

                    `
                    : ""
            }


        </div>

    `;


    return html;

}


// =========================================================
// HTML ESCAPE
// =========================================================

function escapeTripHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// AI CONCIERGE GENERATE BUTTON
// =========================================================

if (
    generateBtn &&
    tripInput &&
    tripResult &&
    aiLoading
) {

    generateBtn.addEventListener(
        "click",
        async function () {

            const query =
                tripInput.value.trim();


            // ---------------------------------------------
            // CHECK INPUT
            // ---------------------------------------------

            if (!query) {

                tripResult.innerHTML =
                    "<p>Please describe your trip first.</p>";

                tripResult.style.display =
                    "block";

                return;

            }


            // ---------------------------------------------
            // SHOW LOADING
            // ---------------------------------------------

            aiLoading.style.display =
                "block";

            tripResult.style.display =
                "none";


            if (aiRecommendation) {

                aiRecommendation.style.display =
                    "none";

            }


            if (aiResult) {

                aiResult.style.display =
                    "block";

            }


            // ---------------------------------------------
            // PLAY POKO
            // ---------------------------------------------

            const pokoVideo =
                document.getElementById(
                    "pokoVideo"
                );


            if (pokoVideo) {

                try {

                    pokoVideo.currentTime =
                        0;

                    await pokoVideo.play();

                } catch (error) {

                    console.log(
                        "Poko animation could not play."
                    );

                }

            }


            try {

                // -----------------------------------------
                // GET EXISTING DESTINATIONS
                // -----------------------------------------

                const response =
                    await fetch(
                        `${TOURSPHERE_API}/api/destinations`
                    );


                if (!response.ok) {

                    throw new Error(
                        `Backend returned ${response.status}`
                    );

                }


                const data =
                    await response.json();


                const destinations =
                    Array.isArray(
                        data.destinations
                    )
                        ? data.destinations
                        : [];


                if (
                    destinations.length === 0
                ) {

                    throw new Error(
                        "No destinations found."
                    );

                }


                // -----------------------------------------
                // FIND DESTINATION
                // -----------------------------------------

                const match =
                    findTripDestination(
                        destinations,
                        query
                    );


                if (
                    !match.destination ||
                    match.score <= 0
                ) {

                    tripResult.innerHTML = `

                        <div
                            class="ts-concierge-error"
                        >

                            ⚠️ I couldn't find that
                            destination in TourSphere.

                            <p>
                                Try a destination such as
                                Puri, Konark, Shillong,
                                Sohra, Shimla, Mashobra
                                or Chichoga.
                            </p>

                        </div>

                    `;

                    tripResult.style.display =
                        "block";

                    return;

                }


                const destination =
                    match.destination;


                // -----------------------------------------
                // USER PREFERENCES
                // -----------------------------------------

                const days =
                    getTripDays(query);


                const travelType =
                    getTripType(query);


                const budget =
                    getTripBudget(
                        query,
                        destination
                    );


                // -----------------------------------------
// CREATE ITINERARY
// -----------------------------------------

tripResult.innerHTML =
    createTripResult(
        destination,
        days,
        travelType,
        budget
    );

// KEEP IT HIDDEN UNTIL POKO FINISHES
tripResult.style.display = "none";


               

                // -----------------------------------------
                // DEBUG
                // -----------------------------------------

                console.log(
                    "TourSphere Concierge:",
                    {
                        destination:
                            destination.place_name,

                        destinationId:
                            destination.id,

                        days,

                        travelType,

                        budget
                    }
                );


            } catch (error) {

                console.error(
                    "TourSphere AI Concierge Error:",
                    error
                );


                tripResult.innerHTML = `

                    <p>

                        <b>
                            Unable to generate the trip.
                        </b>

                        <br>

                        ${escapeTripHtml(
                            error.message
                        )}

                    </p>

                `;


                tripResult.style.display =
                    "block";


           } finally {

    setTimeout(() => {

    // -----------------------------------------
    // POKO FINISHED DANCING
    // -----------------------------------------

    aiLoading.style.display = "none";

    if (pokoVideo) {

        try {

            pokoVideo.pause();

            pokoVideo.currentTime = 0;

        } catch (error) {

            console.log(
                "Poko video reset failed."
            );

        }

    }


    // -----------------------------------------
    // NOW SHOW THE ITINERARY
    // -----------------------------------------

    tripResult.style.display = "block";


    // -----------------------------------------
    // NOW SHOW THE RECOMMENDATION HEADING
    // -----------------------------------------

    if (aiRecommendation) {

        aiRecommendation.style.display =
            "block";

        aiRecommendation.textContent =
            `🏔️ ${
                destination.place_name
            } — Your ${days}-Day Plan`;

    }

}, 7000);

}

        }
    );

}


// =========================================================
// AI CONCIERGE — ENTER KEY
// =========================================================

if (
    tripInput &&
    generateBtn
) {

    tripInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter"
            ) {

                return;

            }


            event.preventDefault();


            generateBtn.click();


            setTimeout(
                function () {

                    if (aiLoading) {

                        aiLoading.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                },
                100
            );

        }
    );

}


// =========================================================
// AI CONCIERGE RESULT STYLING
// Injected automatically.
// No CSS file changes needed.
// =========================================================

if (
    !document.getElementById(
        "tourSphereConciergeStyles"
    )
) {

    const style =
        document.createElement(
            "style"
        );


    style.id =
        "tourSphereConciergeStyles";


    style.textContent = `

        .ts-concierge-card {

            margin-top: 24px;

            padding: 24px;

            border-radius: 22px;

            background:
                rgba(8, 20, 32, 0.72);

            border:
                1px solid
                rgba(75, 220, 210, 0.18);

            box-shadow:
                0 18px 50px
                rgba(0, 0, 0, 0.18);

        }


        .ts-concierge-heading {

            margin-bottom: 22px;

        }


        .ts-concierge-heading > span {

            display:
                inline-block;

            margin-bottom:
                8px;

            color:
                #39ddd0;

            font-size:
                0.78rem;

            font-weight:
                800;

            letter-spacing:
                0.12em;

        }


        .ts-concierge-heading h2 {

            margin:
                0 0 14px;

        }


        .ts-trip-meta {

            display:
                flex;

            flex-wrap:
                wrap;

            gap:
                9px;

        }


        .ts-trip-meta span {

            padding:
                8px 12px;

            border-radius:
                999px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.07
                );

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    0.08
                );

        }


        .ts-day-list {

            display:
                grid;

            gap:
                12px;

        }


        .ts-day-card {

            display:
                grid;

            grid-template-columns:
                92px 1fr;

            gap:
                16px;

            padding:
                18px;

            border-radius:
                17px;

            background:
                rgba(
                    255,
                    255,
                    255,
                    0.045
                );

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    0.08
                );

        }


        .ts-day-number {

            font-size:
                0.78rem;

            font-weight:
                900;

            letter-spacing:
                0.08em;

            color:
                #39ddd0;

            padding-top:
                3px;

        }


        .ts-day-content h3 {

            margin:
                0 0 8px;

        }


        .ts-day-content ul {

            margin:
                0;

            padding-left:
                20px;

        }


        .ts-day-content li {

            margin:
                4px 0;

        }


        .ts-day-tip {

            margin:
                12px 0 0;

            opacity:
                0.72;

            font-size:
                0.92rem;

        }


        .ts-concierge-tip {

            margin-top:
                18px;

            padding:
                17px;

            border-radius:
                15px;

            background:
                rgba(
                    57,
                    221,
                    208,
                    0.08
                );

            border:
                1px solid
                rgba(
                    57,
                    221,
                    208,
                    0.14
                );

        }


        .ts-concierge-tip strong {

            color:
                #39ddd0;

        }


        .ts-concierge-tip p {

            margin:
                7px 0 0;

        }


        .ts-full-destination-btn {

            display:
                inline-block;

            margin-top:
                18px;

            padding:
                12px 17px;

            border-radius:
                13px;

            text-decoration:
                none;

            font-weight:
                800;

            background:
                rgba(
                    57,
                    221,
                    208,
                    0.14
                );

            border:
                1px solid
                rgba(
                    57,
                    221,
                    208,
                    0.25
                );

            color:
                inherit;

        }


        .ts-full-destination-btn:hover {

            background:
                rgba(
                    57,
                    221,
                    208,
                    0.22
                );

        }


        .ts-concierge-error {

            padding:
                17px;

            border-radius:
                15px;

            background:
                rgba(
                    180,
                    60,
                    60,
                    0.15
                );

            border:
                1px solid
                rgba(
                    255,
                    100,
                    100,
                    0.2
                );

        }


        @media (max-width: 650px) {

            .ts-day-card {

                grid-template-columns:
                    1fr;

                gap:
                    7px;

            }


            .ts-trip-meta {

                flex-direction:
                    column;

                align-items:
                    flex-start;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}

const startPlanningBtn = document.getElementById("start-planning-btn");
const tripPlanner = document.querySelector(".trip-planner");

startPlanningBtn.addEventListener("click", (event) => {
    event.preventDefault();

    tripPlanner.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});
// ENTER KEY → GENERATE TRIP
tripInput.addEventListener("keydown", function (event) {

    if (event.key !== "Enter") return;

    event.preventDefault();

    // Run the existing Generate button code
    generateBtn.click();

    // Scroll to the AI thinking animation
    setTimeout(function () {

        if (aiLoading) {
            aiLoading.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

    }, 100);

});
window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".custom-navbar");

    if (!navbar) return;

    if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});
document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".custom-navbar");

    if (!navbar) {
        console.log("TourSphere navbar not found!");
        return;
    }

    function updateNavbar() {

        if (window.scrollY > 60) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", updateNavbar);

    updateNavbar();

});
// =========================================================
// TOURSPHERE TRANSLATOR — TRANSLATE ONLY
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const translateButton =
        document.getElementById("translatorSubmit");

    const input =
        document.getElementById("translatorInput");

    const language =
        document.getElementById("translatorLanguage");

    const resultBox =
        document.getElementById("translatorResult");


    console.log("TourSphere Translator loaded:", {
        translateButton,
        input,
        language,
        resultBox
    });


    // Make sure all translator elements exist
    if (
        !translateButton ||
        !input ||
        !language ||
        !resultBox
    ) {
        console.error(
            "TourSphere Translator: HTML elements not found."
        );

        return;
    }


    // =====================================================
    // TRANSLATE BUTTON
    // =====================================================

    translateButton.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            const text =
                input.value.trim();

            const target =
                language.value;


            // No text entered
            if (!text) {

                resultBox.innerHTML = `
                    <strong>Please enter some text first.</strong>
                `;

                input.focus();

                return;
            }


            // Loading
            translateButton.disabled = true;

            translateButton.textContent =
                "🌐 Translating...";

            resultBox.textContent =
                "Translating...";


            try {

                const apiURL =
                    "http://localhost:8000/api/translate" +
                    "?text=" +
                    encodeURIComponent(text) +
                    "&target=" +
                    encodeURIComponent(target);


                console.log(
                    "TourSphere Translator URL:",
                    apiURL
                );


                const response =
                    await fetch(apiURL);


                console.log(
                    "Translator HTTP status:",
                    response.status
                );


                if (!response.ok) {

                    throw new Error(
                        "Translator API returned " +
                        response.status
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Translator API response:",
                    data
                );


                if (!data.success) {

                    throw new Error(
                        data.error ||
                        "Translation failed."
                    );

                }


                // =================================================
                // SHOW TRANSLATION
                // =================================================

                const translated =
                    String(data.translated || "").trim();


                if (!translated) {

                    throw new Error(
                        "API returned an empty translation."
                    );

                }


                resultBox.innerHTML = `
                    <strong>Translation:</strong>

                    <p style="
                        margin: 8px 0 0;
                        color: #ffffff;
                        font-size: 1.05rem;
                        line-height: 1.6;
                    ">
                        ${translated
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#039;")}
                    </p>
                `;


            } catch (error) {

                console.error(
                    "TourSphere Translator ERROR:",
                    error
                );


                resultBox.innerHTML = `
                    <strong>Translation failed.</strong>
                    <p style="margin-top:8px;">
                        ${error.message}
                    </p>
                `;


            } finally {

                translateButton.disabled = false;

                translateButton.textContent =
                    "🌐 Translate";

            }

        }
    );

});
/* =====================================================
   TOURSPHERE — MINIMAL CINEMATIC LOADER
   HOME LOAD + REFRESH = SHOW
   INTERNAL RETURN TO HOME = SKIP
===================================================== */

const tsLoader = document.getElementById("ts-loader");

if (tsLoader) {

    /*
     * Check whether another TourSphere page intentionally
     * sent the user back to Home.
     */
    const skipLoader =
        sessionStorage.getItem("tsSkipHomeLoader");


    /* =================================================
       INTERNAL RETURN → REMOVE LOADER
    ================================================= */

    if (skipLoader === "true") {

        sessionStorage.removeItem(
            "tsSkipHomeLoader"
        );

        tsLoader.remove();

    }


    /* =================================================
       NORMAL HOME LOAD / REFRESH → SHOW LOADER
    ================================================= */

    else {

        const tsLine =
            document.querySelector(
                ".ts-loader-line span"
            );

        const tsPercent =
            document.getElementById(
                "ts-loader-percent"
            );

        const tsMessage =
            document.getElementById(
                "ts-loader-message"
            );


        const tsMessages = [
            "Discovering the extraordinary...",
            "Finding places beyond the ordinary...",
            "Crafting your journey...",
            "Almost ready..."
        ];


        let tsProgress = 0;

        let tsMessageIndex = 0;


        /* ---------- PROGRESS ---------- */

        const tsProgressTimer =
            setInterval(() => {

                if (tsProgress < 90) {

                    tsProgress +=
                        Math.floor(
                            Math.random() * 3
                        ) + 1;

                    if (tsProgress > 90) {
                        tsProgress = 90;
                    }

                    tsLine.style.width =
                        tsProgress + "%";

                    tsPercent.textContent =
                        tsProgress;
                }

            }, 55);


        /* ---------- MESSAGES ---------- */

        const tsMessageTimer =
            setInterval(() => {

                tsMessageIndex++;


                if (
                    tsMessageIndex >=
                    tsMessages.length
                ) {

                    clearInterval(
                        tsMessageTimer
                    );

                    return;
                }


                tsMessage.style.opacity =
                    "0";

                tsMessage.style.transform =
                    "translateY(5px)";


                setTimeout(() => {

                    tsMessage.textContent =
                        tsMessages[
                            tsMessageIndex
                        ];

                    tsMessage.style.opacity =
                        "1";

                    tsMessage.style.transform =
                        "translateY(0)";

                }, 300);

            }, 900);


        /* ---------- FINISH ---------- */

        window.addEventListener(
            "load",
            () => {

                setTimeout(() => {

                    clearInterval(
                        tsProgressTimer
                    );

                    tsProgress = 100;

                    tsLine.style.width =
                        "100%";

                    tsPercent.textContent =
                        "100";


                    setTimeout(() => {

                        tsLoader.classList.add(
                            "ts-loader-finished"
                        );


                        setTimeout(() => {

                            tsLoader.remove();

                        }, 1300);

                    }, 450);

                }, 4000);

            }
        );

    }
}
/* =====================================================
   TOURSPHERE — INTERNAL HOME NAVIGATION
   Prevent loader when returning to Home
===================================================== */

document.querySelectorAll('a[href="index.html"]').forEach(link => {

    link.addEventListener("click", () => {

        sessionStorage.setItem(
            "tsSkipHomeLoader",
            "true"
        );

    });

});