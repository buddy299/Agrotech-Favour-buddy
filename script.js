/* ─────────── SEARCH PRODUCTS ─────────── */

let searchInput = document.getElementById("product-search");
let locationInput = document.getElementById("location-search");
let searchButton = document.getElementById("search-button");

if (searchButton && searchInput && locationInput) {

    searchButton.addEventListener("click", function() {

        let search = searchInput.value.trim();
        let location = locationInput.value.trim();

        let sellerCards = document.querySelectorAll(".seller-card");

        sellerCards.forEach(function(card) {

            card.style.display = "block";
            card.style.border = "none";

        });


        if (search === "" || location === "") {

            alert("Please enter a product and location.");
            return;

        }


        let product = search.toLowerCase();
        let found = false;


        sellerCards.forEach(function(card) {

            let cardText = card.textContent.toLowerCase();


            if (
                cardText.includes(product) &&
                cardText.includes(location.toLowerCase())
            ) {

                card.style.border = "3px solid green";
                found = true;

            } else {

                card.style.display = "none";

            }

        });


        if (!found) {

            alert(
                "Sorry, we could not find that product in that location."
            );

        }

    });

}


/* ─────────── BUILT-IN SELLER PROFILES ─────────── */

const sellers = [

    {
        id: "favour-farm",
        name: "Favour",
        farmName: "Favour's Farm",
        location: "Ogun",
        products: "Grains, Tubers, Vegetables",
        description: "Locally grown agricultural products.",
        rating: "4.5"
    },

    {
        id: "freshcatch",
        name: "FreshCatch",
        farmName: "FreshCatch",
        location: "Lagos",
        products: "Fish, Poultry",
        description: "Fresh fish and farm products available.",
        rating: "4.8"
    },

    {
        id: "green-valley",
        name: "Favour",
        farmName: "Green Valley Farms",
        location: "Lagos",
        products: "Vegetables, Fruits, Seeds",
        description:
            "Fresh agricultural products available from our farm.",
        rating: "4.7"
    }

];


/* ─────────── CREATE NEW PROFILE ─────────── */

const profileForm =
    document.getElementById("profileForm");


if (profileForm) {

    profileForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const newProfile = {

            id: "seller-" + Date.now(),

            accountType:
                document.getElementById("accountType").value,

            name:
                document.getElementById("name").value,

            farmName:
                document.getElementById("farmName").value,

            location:
                document.getElementById("location").value,

            products:
                document.getElementById("products").value,

            description:
                document.getElementById("description").value,

            rating: "New Seller"

        };


        let savedSellers =
            JSON.parse(
                localStorage.getItem("agrolinkSellers")
            ) || [];


        savedSellers.push(newProfile);


        localStorage.setItem(
            "agrolinkSellers",
            JSON.stringify(savedSellers)
        );


        alert(
            "Your AgroLink profile has been created!"
        );


        /* GO TO THE USER'S PERSONAL PROFILE */

        window.location.href =
            "my-profile.html";

    });

}


/* ─────────── DISPLAY SELLER PROFILE ─────────── */

const sellerId =
    new URLSearchParams(window.location.search)
        .get("seller");


if (sellerId) {

    let savedSellers =
        JSON.parse(
            localStorage.getItem("agrolinkSellers")
        ) || [];


    let allSellers =
        sellers.concat(savedSellers);


    const selectedSeller =
        allSellers.find(function(seller) {

            return seller.id === sellerId;

        });


    if (selectedSeller) {

        const farmName =
            document.getElementById(
                "profile-farm-name"
            );

        const owner =
            document.getElementById(
                "profile-owner"
            );

        const location =
            document.getElementById(
                "profile-location"
            );

        const rating =
            document.getElementById(
                "profile-rating"
            );

        const products =
            document.getElementById(
                "profile-products"
            );

        const description =
            document.getElementById(
                "profile-description"
            );


        if (farmName) {

            farmName.textContent =
                selectedSeller.farmName ||
                selectedSeller.name;

        }


        if (owner) {

            owner.textContent =
                "Seller: " +
                selectedSeller.name;

        }


        if (location) {

            location.textContent =
                "📍 " +
                selectedSeller.location;

        }


        if (rating) {

            rating.textContent =
                "⭐ " +
                selectedSeller.rating;

        }


        if (products) {

            products.textContent =
                selectedSeller.products;

        }


        if (description) {

            description.textContent =
                selectedSeller.description;

        }


        /* ─────────── SHOW SELLER'S PRODUCTS ─────────── */

        const productList =
            document.getElementById(
                "seller-product-list"
            );


        if (productList) {

            productList.innerHTML = "";


            const productItems =
                selectedSeller.products.split(",");


            productItems.forEach(function(product) {

                const productCard =
                    document.createElement("div");


                productCard.className =
                    "seller-product";


                productCard.innerHTML = `
                    <h3>${product.trim()}</h3>
                    <p>Available from this seller</p>
                `;


                productList.appendChild(productCard);

            });

        }

    }

}


/* ─────────── SHOW NEW SELLERS IN FIND PRODUCTS ─────────── */

const sellerList =
    document.getElementById("seller-list");


if (sellerList) {

    const savedSellers =
        JSON.parse(
            localStorage.getItem("agrolinkSellers")
        ) || [];


    savedSellers.forEach(function(seller) {

        const sellerCard =
            document.createElement("div");


        sellerCard.className =
            "seller-card";


        sellerCard.innerHTML = `

            <h3>
                ${seller.farmName || seller.name}
            </h3>

            <p>
                📍 ${seller.location}
            </p>

            <p>
                ⭐ ${seller.rating}
            </p>

            <p>
                ${seller.products}
            </p>

            <p>
                ${seller.description}
            </p>

            <a href="seller-profile.html?seller=${seller.id}">
                View Profile
            </a>

        `;


        sellerList.appendChild(sellerCard);

    });

}


/* ─────────── DISPLAY MY PROFILE ─────────── */

const myProfileName =
    document.getElementById(
        "my-profile-name"
    );

const myProfileFarm =
    document.getElementById(
        "my-profile-farm"
    );

const myProfileLocation =
    document.getElementById(
        "my-profile-location"
    );

const myProfileDescription =
    document.getElementById(
        "my-profile-description"
    );


if (myProfileName) {

    const savedSellers =
        JSON.parse(
            localStorage.getItem("agrolinkSellers")
        ) || [];


    /* GET THE MOST RECENTLY CREATED PROFILE */

    const myProfile =
        savedSellers[
            savedSellers.length - 1
        ];


    const noProfileMessage =
        document.getElementById(
            "no-profile-message"
        );


    if (myProfile) {

        myProfileName.textContent =
            myProfile.name;


        myProfileFarm.textContent =
            myProfile.farmName ||
            "No farm or business name";


        myProfileLocation.textContent =
            "📍 " +
            myProfile.location;


        myProfileDescription.textContent =
            myProfile.description;


        /* HIDE CREATE PROFILE MESSAGE */

        if (noProfileMessage) {

            noProfileMessage.style.display =
                "none";

        }

    } else {

        /* SHOW CREATE PROFILE MESSAGE */

        if (noProfileMessage) {

            noProfileMessage.style.display =
                "block";

        }

    }

}


/* ─────────── DELETE SELLER PROFILE ─────────── */

const deleteProfileButton =
    document.getElementById(
        "delete-profile-button"
    );

const deletePopup =
    document.getElementById(
        "delete-popup"
    );

const cancelDelete =
    document.getElementById(
        "cancel-delete"
    );

const confirmDelete =
    document.getElementById(
        "confirm-delete"
    );

const deleteSuccessPopup =
    document.getElementById(
        "delete-success-popup"
    );

const successOk =
    document.getElementById(
        "success-ok"
    );


if (deleteProfileButton && sellerId) {

    const savedSellers =
        JSON.parse(
            localStorage.getItem("agrolinkSellers")
        ) || [];


    /* CHECK IF THIS IS A USER-CREATED PROFILE */

    const profileExists =
        savedSellers.some(function(seller) {

            return seller.id === sellerId;

        });


    /* HIDE DELETE BUTTON FOR BUILT-IN PROFILES */

    if (!profileExists) {

        deleteProfileButton.style.display =
            "none";

    }


    /* OPEN DELETE POPUP */

    deleteProfileButton.addEventListener(
        "click",
        function() {

            deletePopup.style.display =
                "flex";

        }
    );


    /* CANCEL DELETE */

    cancelDelete.addEventListener(
        "click",
        function() {

            deletePopup.style.display =
                "none";

        }
    );


    /* CONFIRM DELETE */

    confirmDelete.addEventListener(
        "click",
        function() {

            const updatedSellers =
                savedSellers.filter(
                    function(seller) {

                        return seller.id !== sellerId;

                    }
                );


            /* SAVE UPDATED SELLER LIST */

            localStorage.setItem(
                "agrolinkSellers",
                JSON.stringify(
                    updatedSellers
                )
            );


            /* CLOSE DELETE POPUP */

            deletePopup.style.display =
                "none";


            /* SHOW SUCCESS POPUP */

            deleteSuccessPopup.style.display =
                "flex";

        }
    );


    /* CLOSE SUCCESS POPUP */

    successOk.addEventListener(
        "click",
        function() {

            window.location.href =
                "marketplace.html";

        }
    );

}