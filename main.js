// Bas-URL till API och API-nyckel
const apiBaseUrl = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com';
const apiKey = 'solaris-2ngXkR6S02ijFrTP'; // Ange en giltig API-nyckel

// Global variabel för att lagra alla hämtade himlakroppar
let allBodies = [];

// Kör när DOM-innehållet är färdigladdat
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialiserar appen
function initializeApp() {
    fetchBodies(); // Hämta data om himlakropparna
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        // Lyssna efter "Enter"-tangenttryck
        searchInput.addEventListener('keypress', handleSearchInput);
        // Lyssna efter ändringar i sökfältet
        searchInput.addEventListener('input', filterBodies);
    }
}

// Hämtar himlakroppar från API
async function fetchBodies() {
    try {
        const response = await fetch(`${apiBaseUrl}/bodies`, {
            method: 'GET',
            headers: { 'x-zocom': apiKey },
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Kontrollera att bodies är en array innan användning
        if (Array.isArray(data.bodies)) {
            allBodies = data.bodies; // Spara arrayen i allBodies
        } else {
            throw new Error("Invalid API response format: 'bodies' is not an array.");
        }
    } catch (error) {
        console.error("Error fetching solar system data:", error.message);
        showError("Could not fetch data. Please try again later.");
    }
}

// Visar himlakropparna i en container
function displayBodies(bodies) {
    const container = document.getElementById('bodiesContainer');

    if (!container) {
        console.error("Container element 'bodiesContainer' not found.");
        return;
    }

    container.innerHTML = ''; // Rensa tidigare innehåll

    if (bodies.length === 0) {
        const searchTerm = getSearchInputValue();
        if (searchTerm) {
            container.innerHTML = `<p>No planets found matching "${searchTerm}".</p>`;
        }
        return;
    }
}

// Hanterar sök-input när användaren trycker på "Enter"
function handleSearchInput(event) {
    if (event.key === 'Enter') {
        const searchTerm = getSearchInputValue();
        const validPlanets = [
            'merkurius', 'venus', 'jorden', 'mars', 'jupiter',
            'saturnus', 'uranus', 'neptunus', 'solen', 'index'
        ];

        if (validPlanets.includes(searchTerm)) {
            window.location.href = `${searchTerm}.html`; // Navigera till planetens sida
        } else {
            alert('Invalid input! Please enter a valid planet name or "solen".');
        }
    }
}

// Filtrerar himlakroppar baserat på användarens input
function filterBodies() {
    const searchTerm = getSearchInputValue();

    const filteredBodies = allBodies.filter(body =>
        body.name.toLowerCase().includes(searchTerm) ||
        body.latinName.toLowerCase().includes(searchTerm)
    );

    displayBodies(filteredBodies); // Visa filtrerade resultat
}

// Hämtar och rensar användarens sökinput
function getSearchInputValue() {
    const searchInput = document.getElementById('searchInput');
    return searchInput ? searchInput.value.toLowerCase().trim() : '';
}

// Visar ett felmeddelande i containern
function showError(message) {
    const container = document.getElementById('bodiesContainer');
    if (container) {
        container.innerHTML = `<p class="error">${message}</p>`;
    }
}
