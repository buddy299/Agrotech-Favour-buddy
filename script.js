let searchInput = document.getElementById("search-input");
let locationInput = document.getElementById("location-input");
let searchButton = document.getElementById("search-button");
let searchResult = document.getElementById("search-result");

let tomatoes = document.getElementById("tomatoes");
let maize = document.getElementById("maize");
let rice = document.getElementById("rice");
let cassava = document.getElementById("cassava");

searchButton.addEventListener("click", function() {

    let search = searchInput.value;
    let location = locationInput.value;

    // Remove old highlights
    tomatoes.style.border = "none";
    maize.style.border = "none";
    rice.style.border = "none";
    cassava.style.border = "none";

    if (search === "" || location === "") {

        searchResult.textContent = "Please enter a product and location.";

    } else {

        let product = search.toLowerCase();

        if (product === "tomatoes" || product === "tomato") {

            searchResult.textContent = "Fresh Tomatoes are available in " + location;
            tomatoes.style.border = "3px solid green";

        } else if (product === "maize") {

            searchResult.textContent = "Maize is available in " + location;
            maize.style.border = "3px solid green";

        } else if (product === "rice") {

            searchResult.textContent = "Local Rice is available in " + location;
            rice.style.border = "3px solid green";

        } else if (product === "cassava") {

            searchResult.textContent = "Cassava is available in " + location;
            cassava.style.border = "3px solid green";

        } else {

            searchResult.textContent = "Sorry, we could not find that product.";

        }
    }

});