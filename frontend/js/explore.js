const destinationResults = document.getElementById("destinationResults");
const stateButtons = document.querySelectorAll(".explore-state-btn[data-state]");

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
}

async function loadState(state) {
    destinationResults.innerHTML = `
        <span><i class="fa-solid fa-spinner fa-spin"></i> LOADING DATABASE</span>
        <h2>Finding destinations in ${escapeHtml(state)}...</h2>
        <p>Please wait while TourSphere loads the destination data.</p>
    `;

    try {
       const response = await fetch(
    `http://localhost:8000/api/destinations/state/${encodeURIComponent(state)}`
);  
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Could not load destinations.");
        }

        const destinations = data.destinations || [];
        if (!destinations.length) {
            destinationResults.innerHTML = `
                <span><i class="fa-solid fa-location-dot"></i> DATABASE RESULTS</span>
                <h2>No destinations found for ${escapeHtml(state)}</h2>
                <p>Try another state.</p>
            `;
            return;
        }

       const cards = destinations.map(dest => {

    const favoriteId = String(dest.id);

    return `
        <div class="col-md-6 col-lg-4">
            <div class="destination-card-modern">

                <div class="destination-card-body">

                    <!-- DESTINATION TITLE -->
                    <div class="destination-title-row">

                        <h4 class="destination-name">
                            ${escapeHtml(dest.place_name)}
                        </h4>

                        <button
                            class="favorite-heart-btn"
                            type="button"
                            data-favorite-id="${escapeHtml(favoriteId)}"
                            onclick="toggleFavoriteFromExplore(this, ${JSON.stringify({
                                id: dest.id,
                                place_name: dest.place_name,
                                state: dest.state,
                                description: dest.description || "No description available.",
                                category: dest.category || "Destination",
                                estimate_budget: dest.estimate_budget || "Budget not specified",
                                crowd_level: dest.crowd_level || "Unknown",
                                rating: dest.rating || "Not rated",
                                hidden_gem: dest.hidden_gem || ""
                            }).replace(/"/g, '&quot;')})"
                            aria-label="Save ${escapeHtml(dest.place_name)} to favorites"
                        >
                            <i class="fa-regular fa-heart"></i>
                        </button>

                    </div>


                    <!-- CATEGORY + LOCATION -->
                    <div class="destination-meta">

                        <span class="destination-location">
                            <i class="fa-solid fa-location-dot"></i>
                            ${escapeHtml(dest.state)}
                        </span>

                        <span class="destination-category">
                            ${escapeHtml(dest.category || "Destination")}
                        </span>

                    </div>


                    <!-- DESCRIPTION -->
                    <p class="destination-description">
                        ${escapeHtml(
                            dest.description || "No description available."
                        )}
                    </p>


                    <!-- INFORMATION -->
                    <div class="destination-info">

                        <div class="destination-info-item">
                            <span>💰</span>
                            <span>
                                ${escapeHtml(
                                    dest.estimate_budget ||
                                    "Budget not specified"
                                )}
                            </span>
                        </div>

                        <div class="destination-info-item">
                            <span>👥</span>
                            <span>
                                Crowd:
                                ${escapeHtml(
                                    dest.crowd_level || "Unknown"
                                )}
                            </span>
                        </div>

                        <div class="destination-info-item">
                            <span>⭐</span>
                            <span>
                                Rating:
                                ${escapeHtml(
                                    dest.rating || "Not rated"
                                )}
                            </span>
                        </div>

                        ${
                            dest.hidden_gem
                                ? `
                                    <div class="destination-info-item hidden-gem-info">
                                        <span>💎</span>
                                        <span>
                                            Hidden gem:
                                            ${escapeHtml(dest.hidden_gem)}
                                        </span>
                                    </div>
                                  `
                                : ""
                        }

                    </div>


                    <!-- EXPLORE BUTTON -->
                    <a
                        href="destination.html?id=${encodeURIComponent(dest.id)}"
                        class="destination-explore-btn"
                    >
                        <span>Explore Destination</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>

                </div>

            </div>
        </div>
    `;
}).join("");

        destinationResults.innerHTML = `
            <span><i class="fa-solid fa-database"></i> DATABASE RESULTS</span>
            <h2>Explore ${escapeHtml(state)}</h2>
            <p>${destinations.length} destination${destinations.length === 1 ? "" : "s"} loaded from the TourSphere database.</p>
            <div class="row g-4 mt-3">${cards}</div>
        `;
        updateFavoriteHearts();
    } catch (error) {
        destinationResults.innerHTML = `
            <span><i class="fa-solid fa-triangle-exclamation"></i> CONNECTION ERROR</span>
            <h2>Could not load the database</h2>
            <p>${escapeHtml(error.message)}</p>
            <p class="small">Make sure the Node backend is running on port 8000 and PostgreSQL has been seeded.</p>
        `;
    }
}

stateButtons.forEach(button => {
    button.addEventListener("click", () => loadState(button.dataset.state));
});
/* =========================================================
   TOURSPHERE FAVORITES
========================================================= */

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("tourSphereFavorites")) || [];
    } catch (error) {
        console.error("Could not read favorites:", error);
        return [];
    }
}


function saveFavorites(favorites) {
    localStorage.setItem(
        "tourSphereFavorites",
        JSON.stringify(favorites)
    );
}


function toggleFavoriteFromExplore(button, destination) {

    const favorites = getFavorites();

    const existingIndex = favorites.findIndex(
        item => String(item.id) === String(destination.id)
    );

    if (existingIndex !== -1) {

        /* REMOVE */
        favorites.splice(existingIndex, 1);

        button.classList.remove("is-favorite");

        button.innerHTML = `
            <i class="fa-regular fa-heart"></i>
        `;

        button.setAttribute(
            "aria-label",
            `Save ${destination.place_name} to favorites`
        );

    } else {

        /* ADD */
        favorites.push(destination);

        button.classList.add("is-favorite");

        button.innerHTML = `
            <i class="fa-solid fa-heart"></i>
        `;

        button.setAttribute(
            "aria-label",
            `Remove ${destination.place_name} from favorites`
        );

    }

    saveFavorites(favorites);
}


/* Restore heart state when destinations load */

function updateFavoriteHearts() {

    const favorites = getFavorites();

    document
        .querySelectorAll(".favorite-heart-btn")
        .forEach(button => {

            const id = button.dataset.favoriteId;

            const isFavorite = favorites.some(
                item => String(item.id) === String(id)
            );

            if (isFavorite) {

                button.classList.add("is-favorite");

                button.innerHTML = `
                    <i class="fa-solid fa-heart"></i>
                `;

            } else {

                button.classList.remove("is-favorite");

                button.innerHTML = `
                    <i class="fa-regular fa-heart"></i>
                `;
            }
        });
}