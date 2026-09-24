/* ─────────── POPUP ─────────── */

function showAgroPopup(
    title,
    message,
    buttonText = "OK",
    action = null
) {

    const oldPopup =
        document.getElementById("agrolink-popup");

    if (oldPopup) {
        oldPopup.remove();
    }

    const popup =
        document.createElement("div");

    popup.id = "agrolink-popup";
    popup.className = "agrolink-popup";

    popup.innerHTML = `
        <div class="agrolink-popup-box">

            <div class="agrolink-popup-icon">
                ✓
            </div>

            <h2>${title}</h2>

            <p>${message}</p>

            <button id="agrolink-popup-button">
                ${buttonText}
            </button>

        </div>
    `;

    document.body.appendChild(popup);

    document
        .getElementById("agrolink-popup-button")
        .addEventListener("click", function() {

            popup.remove();

            if (action) {
                action();
            }

        });

}


/* ─────────── SEARCH PRODUCTS ─────────── */

let searchInput =
    document.getElementById("product-search");

let locationInput =
    document.getElementById("location-search");

let searchButton =
    document.getElementById("search-button");


if (
    searchButton &&
    searchInput &&
    locationInput
) {

    searchButton.addEventListener(
        "click",
        function() {

            let search =
                searchInput.value.trim();

            let location =
                locationInput.value.trim();

            let sellerCards =
                document.querySelectorAll(
                    ".seller-card"
                );

            sellerCards.forEach(function(card) {

                card.style.display = "block";
                card.style.border = "none";

            });


            if (
                search === "" ||
                location === ""
            ) {

                showAgroPopup(
                    "Search Required",
                    "Please enter a product and location."
                );

                return;

            }


            let product =
                search.toLowerCase();

            let found = false;


            sellerCards.forEach(
                function(card) {

                    let cardText =
                        card.textContent.toLowerCase();


                    if (
                        cardText.includes(product) &&
                        cardText.includes(
                            location.toLowerCase()
                        )
                    ) {

                        card.style.border =
                            "3px solid green";

                        found = true;

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );


            if (!found) {

                showAgroPopup(
                    "No Results",
                    "Sorry, we could not find that product in that location."
                );

            }

        }
    );

}


/* ─────────── BUILT-IN SELLER PROFILES ─────────── */

const sellers = [

    {
        id: "favour-farm",
        name: "Favour",
        farmName: "Favour's Farm",
        location: "Ogun",
        description:
            "Locally grown agricultural products.",
        rating: "4.5"
    },

    {
        id: "freshcatch",
        name: "FreshCatch",
        farmName: "FreshCatch",
        location: "Lagos",
        description:
            "Fresh fish and farm products available.",
        rating: "4.8"
    },

    {
        id: "green-valley",
        name: "Favour",
        farmName: "Green Valley Farms",
        location: "Lagos",
        description:
            "Fresh agricultural products available from our farm.",
        rating: "4.7"
    }

];


/* ─────────── CREATE NEW PROFILE ─────────── */

const profileForm =
    document.getElementById("profileForm");


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const newProfile = {

                id:
                    "seller-" +
                    Date.now(),

                accountType:
                    document.getElementById(
                        "accountType"
                    ).value,

                name:
                    document.getElementById(
                        "name"
                    ).value.trim(),

                farmName:
                    document.getElementById(
                        "farmName"
                    ).value.trim(),

                location:
                    document.getElementById(
                        "location"
                    ).value.trim(),

                description:
                    document.getElementById(
                        "description"
                    ).value.trim(),

                rating:
                    "New Seller"

            };


            let savedSellers =
                JSON.parse(
                    localStorage.getItem(
                        "agrolinkSellers"
                    )
                ) || [];


            savedSellers.push(newProfile);


            localStorage.setItem(
                "agrolinkSellers",
                JSON.stringify(savedSellers)
            );


            showAgroPopup(
                "Profile Created",
                "Your AgroLink profile has been created successfully.",
                "Continue",
                function() {

                    window.location.href =
                        "my-profile.html";

                }
            );

        }
    );

}


/* ─────────── DISPLAY SELLER PROFILE ─────────── */

const sellerId =
    new URLSearchParams(
        window.location.search
    ).get("seller");


if (sellerId) {

    let savedSellers =
        JSON.parse(
            localStorage.getItem(
                "agrolinkSellers"
            )
        ) || [];


    let allSellers =
        sellers.concat(savedSellers);


    const selectedSeller =
        allSellers.find(
            function(seller) {

                return seller.id === sellerId;

            }
        );


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

            const sellerProducts =
                JSON.parse(
                    localStorage.getItem(
                        "agrolinkProducts"
                    )
                ) || [];


            const availableProducts =
                sellerProducts.filter(
                    function(product) {

                        return (
                            product.sellerId ===
                            selectedSeller.id &&
                            product.availability ===
                            "available"
                        );

                    }
                );


            if (
                availableProducts.length > 0
            ) {

                products.textContent =
                    availableProducts
                        .map(function(product) {
                            return product.name;
                        })
                        .join(", ");

            } else {

                products.textContent =
                    "No products currently available";

            }

        }


        if (description) {

            description.textContent =
                selectedSeller.description;

        }


        /* ─────────── SHOW SELLER'S LISTED PRODUCTS ─────────── */

        const productList =
            document.getElementById(
                "seller-product-list"
            );


        if (productList) {

            productList.innerHTML = "";


            const sellerProducts =
                JSON.parse(
                    localStorage.getItem(
                        "agrolinkProducts"
                    )
                ) || [];


            const productsForSeller =
                sellerProducts.filter(
                    function(product) {

                        return (
                            product.sellerId ===
                            selectedSeller.id &&
                            product.availability ===
                            "available"
                        );

                    }
                );


            if (
                productsForSeller.length === 0
            ) {

                productList.innerHTML = `
                    <p class="no-products">
                        No products currently available.
                    </p>
                `;

            } else {

                productsForSeller.forEach(
                    function(product) {

                        const productCard =
                            document.createElement(
                                "div"
                            );


                        productCard.className =
                            "seller-product";


                        productCard.innerHTML = `

                            <h3>
                                ${product.name}
                            </h3>

                            <p>
                                Price:
                                ₦${Number(
                                    product.price
                                ).toLocaleString()}
                            </p>

                            <p>
                                Quantity:
                                ${product.quantity}
                            </p>

                            <p>
                                📍 ${product.location}
                            </p>

                            <p>
                                Available
                            </p>

                        `;


                        productList.appendChild(
                            productCard
                        );

                    }
                );

            }

        }

    }

}


/* ─────────── SHOW NEW SELLERS IN FIND PRODUCTS ─────────── */

const sellerList =
    document.getElementById(
        "seller-list"
    );


if (sellerList) {

    const savedSellers =
        JSON.parse(
            localStorage.getItem(
                "agrolinkSellers"
            )
        ) || [];


    const savedProducts =
        JSON.parse(
            localStorage.getItem(
                "agrolinkProducts"
            )
        ) || [];


    savedSellers.forEach(
        function(seller) {

            const sellerCard =
                document.createElement(
                    "div"
                );


            sellerCard.className =
                "seller-card";


            const availableProducts =
                savedProducts.filter(
                    function(product) {

                        return (
                            product.sellerId ===
                            seller.id &&
                            product.availability ===
                            "available"
                        );

                    }
                );


            const productNames =
                availableProducts
                    .map(function(product) {
                        return product.name;
                    })
                    .join(", ");


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
                    ${
                        productNames ||
                        "No products currently available"
                    }
                </p>

                <p>
                    ${seller.description}
                </p>

                <a
                    href="seller-profile.html?seller=${seller.id}"
                >
                    View Profile
                </a>

            `;


            sellerList.appendChild(
                sellerCard
            );

        }
    );

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
            localStorage.getItem(
                "agrolinkSellers"
            )
        ) || [];


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


        if (noProfileMessage) {

            noProfileMessage.style.display =
                "none";

        }

    } else {

        if (noProfileMessage) {

            noProfileMessage.style.display =
                "block";

        }

    }

}


/* ─────────── DISPLAY MY PRODUCTS ─────────── */

const myProductList =
    document.getElementById(
        "my-product-list"
    );


if (myProductList) {

    const savedSellers =
        JSON.parse(
            localStorage.getItem(
                "agrolinkSellers"
            )
        ) || [];


    const myProfile =
        savedSellers[
            savedSellers.length - 1
        ];


    const products =
        JSON.parse(
            localStorage.getItem(
                "agrolinkProducts"
            )
        ) || [];


    myProductList.innerHTML = "";


    if (!myProfile) {

        myProductList.innerHTML = `
            <p class="no-products">
                Create a profile before listing products.
            </p>
        `;

    } else {

        const myProducts =
            products.filter(
                function(product) {

                    return (
                        product.sellerId ===
                        myProfile.id
                    );

                }
            );


        if (myProducts.length === 0) {

            myProductList.innerHTML = `
                <p class="no-products">
                    You have not listed any products yet.
                </p>
            `;

        } else {

            myProducts.forEach(
                function(product) {

                    const productCard =
                        document.createElement(
                            "div"
                        );


                    productCard.className =
                        "my-product-card";


                    productCard.innerHTML = `

                        <div class="my-product-top">

                            <h3>
                                ${product.name}
                            </h3>

                            <span class="${
                                product.availability ===
                                "available"
                                    ? "product-available"
                                    : "product-out"
                            }">

                                ${
                                    product.availability ===
                                    "available"
                                        ? "Available"
                                        : "Out of Stock"
                                }

                            </span>

                        </div>


                        <p>
                            Price:
                            ₦${Number(
                                product.price
                            ).toLocaleString()}
                        </p>


                        <p>
                            Quantity:
                            ${product.quantity}
                        </p>


                        <p>
                            Location:
                            ${product.location}
                        </p>


                        <button
                            class="edit-product-button"
                            data-product-id="${product.id}"
                        >
                            Edit Product
                        </button>

                    `;


                    myProductList.appendChild(
                        productCard
                    );

                }
            );

        }

    }

}


/* ─────────── EDIT PROFILE ─────────── */

const editProfileButton =
    document.getElementById(
        "edit-profile"
    );


if (editProfileButton) {

    editProfileButton.addEventListener(
        "click",
        function() {

            const savedSellers =
                JSON.parse(
                    localStorage.getItem(
                        "agrolinkSellers"
                    )
                ) || [];


            if (savedSellers.length === 0) {

                showAgroPopup(
                    "No Profile Found",
                    "Please create your AgroLink profile first."
                );

                return;

            }


            const currentSeller =
                savedSellers[
                    savedSellers.length - 1
                ];


            const oldPopup =
                document.getElementById(
                    "edit-profile-popup"
                );


            if (oldPopup) {
                oldPopup.remove();
            }


            const popup =
                document.createElement(
                    "div"
                );


            popup.id =
                "edit-profile-popup";

            popup.className =
                "edit-profile-popup";


            popup.innerHTML = `

                <div class="edit-profile-popup-box">

                    <h2>
                        Edit Your Profile
                    </h2>


                    <form
                        id="editProfileForm"
                        class="edit-profile-form"
                    >

                        <label for="editName">
                            Name
                        </label>

                        <input
                            type="text"
                            id="editName"
                            value="${currentSeller.name || ""}"
                            required
                        >


                        <label for="editFarmName">
                            Farm / Business Name
                        </label>

                        <input
                            type="text"
                            id="editFarmName"
                            value="${currentSeller.farmName || ""}"
                        >


                        <label for="editLocation">
                            Location
                        </label>

                        <input
                            type="text"
                            id="editLocation"
                            value="${currentSeller.location || ""}"
                            required
                        >


                        <label for="editDescription">
                            About You / Your Business
                        </label>

                        <textarea
                            id="editDescription"
                            required
                        >${currentSeller.description || ""}</textarea>


                        <div class="edit-profile-buttons">

                            <button
                                type="button"
                                class="edit-cancel-button"
                                id="cancel-edit-profile"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                class="edit-save-button"
                            >
                                Save Changes
                            </button>

                        </div>

                    </form>

                </div>

            `;


            document.body.appendChild(
                popup
            );


            document
                .getElementById(
                    "cancel-edit-profile"
                )
                .addEventListener(
                    "click",
                    function() {

                        popup.remove();

                    }
                );


            document
                .getElementById(
                    "editProfileForm"
                )
                .addEventListener(
                    "submit",
                    function(event) {

                        event.preventDefault();


                        currentSeller.name =
                            document
                                .getElementById(
                                    "editName"
                                )
                                .value
                                .trim();


                        currentSeller.farmName =
                            document
                                .getElementById(
                                    "editFarmName"
                                )
                                .value
                                .trim();


                        currentSeller.location =
                            document
                                .getElementById(
                                    "editLocation"
                                )
                                .value
                                .trim();


                        currentSeller.description =
                            document
                                .getElementById(
                                    "editDescription"
                                )
                                .value
                                .trim();


                        savedSellers[
                            savedSellers.length - 1
                        ] = currentSeller;


                        localStorage.setItem(
                            "agrolinkSellers",
                            JSON.stringify(
                                savedSellers
                            )
                        );


                        popup.remove();


                        myProfileName.textContent =
                            currentSeller.name;


                        myProfileFarm.textContent =
                            currentSeller.farmName ||
                            "No farm or business name";


                        myProfileLocation.textContent =
                            "📍 " +
                            currentSeller.location;


                        myProfileDescription.textContent =
                            currentSeller.description;


                        showAgroPopup(
                            "Profile Updated",
                            "Your AgroLink profile has been successfully updated."
                        );

                    }
                );

        }
    );

}


/* ─────────── EDIT LISTED PRODUCT ─────────── */

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.classList.contains(
                "edit-product-button"
            )
        ) {

            return;

        }


        const productId =
            event.target.getAttribute(
                "data-product-id"
            );


        let products =
            JSON.parse(
                localStorage.getItem(
                    "agrolinkProducts"
                )
            ) || [];


        const product =
            products.find(
                function(item) {

                    return item.id === productId;

                }
            );


        if (!product) {
            return;
        }


        const oldPopup =
            document.getElementById(
                "edit-product-popup"
            );


        if (oldPopup) {
            oldPopup.remove();
        }


        const popup =
            document.createElement(
                "div"
            );


        popup.id =
            "edit-product-popup";

        popup.className =
            "edit-profile-popup";


        popup.innerHTML = `

            <div class="edit-profile-popup-box">

                <h2>
                    Edit Product
                </h2>


                <form
                    id="editProductForm"
                    class="edit-profile-form"
                >

                    <label for="editProductName">
                        Product Name
                    </label>

                    <input
                        type="text"
                        id="editProductName"
                        value="${product.name}"
                        required
                    >


                    <label for="editProductPrice">
                        Price
                    </label>

                    <input
                        type="number"
                        id="editProductPrice"
                        value="${product.price}"
                        required
                    >


                    <label for="editProductQuantity">
                        Quantity Available
                    </label>

                    <input
                        type="number"
                        id="editProductQuantity"
                        value="${product.quantity}"
                        required
                    >


                    <label for="editProductLocation">
                        Location
                    </label>

                    <input
                        type="text"
                        id="editProductLocation"
                        value="${product.location}"
                        required
                    >


                    <label for="editProductAvailability">
                        Availability
                    </label>

                    <select
                        id="editProductAvailability"
                        required
                    >

                        <option
                            value="available"
                            ${
                                product.availability ===
                                "available"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Available
                        </option>


                        <option
                            value="out-of-stock"
                            ${
                                product.availability ===
                                "out-of-stock"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Out of Stock
                        </option>

                    </select>


                    <div class="edit-profile-buttons">

                        <button
                            type="button"
                            class="edit-cancel-button"
                            id="cancel-edit-product"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            class="edit-save-button"
                        >
                            Save Changes
                        </button>

                    </div>

                </form>

            </div>

        `;


        document.body.appendChild(
            popup
        );


        document
            .getElementById(
                "cancel-edit-product"
            )
            .addEventListener(
                "click",
                function() {

                    popup.remove();

                }
            );


        document
            .getElementById(
                "editProductForm"
            )
            .addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    product.name =
                        document
                            .getElementById(
                                "editProductName"
                            )
                            .value
                            .trim();


                    product.price =
                        document
                            .getElementById(
                                "editProductPrice"
                            )
                            .value;


                    product.quantity =
                        document
                            .getElementById(
                                "editProductQuantity"
                            )
                            .value;


                    product.location =
                        document
                            .getElementById(
                                "editProductLocation"
                            )
                            .value
                            .trim();


                    product.availability =
                        document
                            .getElementById(
                                "editProductAvailability"
                            )
                            .value;


                    localStorage.setItem(
                        "agrolinkProducts",
                        JSON.stringify(
                            products
                        )
                    );


                    popup.remove();


                    showAgroPopup(
                        "Product Updated",
                        "Your product information has been successfully updated.",
                        "OK",
                        function() {

                            window.location.reload();

                        }
                    );

                }
            );

    }
);


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


if (
    deleteProfileButton &&
    sellerId
) {

    const savedSellers =
        JSON.parse(
            localStorage.getItem(
                "agrolinkSellers"
            )
        ) || [];


    const profileExists =
        savedSellers.some(
            function(seller) {

                return seller.id === sellerId;

            }
        );


    if (!profileExists) {

        deleteProfileButton.style.display =
            "none";

    }


    deleteProfileButton.addEventListener(
        "click",
        function() {

            deletePopup.style.display =
                "flex";

        }
    );


    cancelDelete.addEventListener(
        "click",
        function() {

            deletePopup.style.display =
                "none";

        }
    );


    confirmDelete.addEventListener(
        "click",
        function() {

            const updatedSellers =
                savedSellers.filter(
                    function(seller) {

                        return seller.id !== sellerId;

                    }
                );


            localStorage.setItem(
                "agrolinkSellers",
                JSON.stringify(
                    updatedSellers
                )
            );


            /* REMOVE THE USER'S PRODUCTS TOO */

            let products =
                JSON.parse(
                    localStorage.getItem(
                        "agrolinkProducts"
                    )
                ) || [];


            products =
                products.filter(
                    function(product) {

                        return product.sellerId !== sellerId;

                    }
                );


            localStorage.setItem(
                "agrolinkProducts",
                JSON.stringify(products)
            );


            deletePopup.style.display =
                "none";


            deleteSuccessPopup.style.display =
                "flex";

        }
    );


    successOk.addEventListener(
        "click",
        function() {

            window.location.href =
                "marketplace.html";

        }
    );

}

// ==================== AGRICULTURAL PRICES ====================

const priceResults = document.getElementById("price-results");
const priceSearch = document.getElementById("price-search");
const priceCategory = document.getElementById("price-category");
const priceSearchButton = document.getElementById("price-search-button");

if (priceResults) {

    let agriculturalPrices = [];

    async function loadPrices() {

        priceResults.innerHTML = `
            <p class="price-loading">
                Loading current agricultural prices...
            </p>
        `;

        try {

            const response = await fetch(
                "https://opaindex.com/commodities/prices.json?category=agriculture"
            );

            if (!response.ok) {
                throw new Error("Unable to load price data.");
            }

            const data = await response.json();

            agriculturalPrices = data.prices || [];

            displayPrices(agriculturalPrices);

        } catch (error) {

            console.error("Price loading error:", error);

            priceResults.innerHTML = `
                <div class="price-error">
                    <h3>Prices Unavailable</h3>
                    <p>
                        We could not load the latest agricultural
                        prices right now. Please try again later.
                    </p>
                </div>
            `;
        }
    }

    function displayPrices(prices) {

        if (prices.length === 0) {

            priceResults.innerHTML = `
                <p class="no-prices">
                    No agricultural prices were found.
                </p>
            `;

            return;
        }

        priceResults.innerHTML = "";

        prices.forEach(function(price) {

            const priceCard = document.createElement("div");

            priceCard.className = "price-card";

            const formattedPrice =
                new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: price.currency || "NGN",
                    maximumFractionDigits: 0
                }).format(price.price);

            const updatedDate =
                new Date(price.asOf).toLocaleDateString(
                    "en-NG",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                );

            priceCard.innerHTML = `
                <h3>${price.name}</h3>

                <p>Current market price</p>

                <h4>${formattedPrice}</h4>

                <p>${price.unit}</p>

                <p>
                    <strong>Market:</strong>
                    ${price.market}
                </p>

                <p>
                    <strong>Updated:</strong>
                    ${updatedDate}
                </p>

                <small>
                    Source: ${price.source}
                </small>

                <small>
                    Confidence: ${price.confidence}
                </small>
            `;

            priceResults.appendChild(priceCard);
        });
    }

    function searchPrices() {

        const searchText =
            priceSearch.value.trim().toLowerCase();

        const selectedCategory =
            priceCategory.value;

        const filteredPrices =
            agriculturalPrices.filter(function(price) {

                const matchesSearch =
                    price.name.toLowerCase().includes(searchText);

                const matchesCategory =
                    selectedCategory === "all" ||
                    price.category === selectedCategory;

                return matchesSearch && matchesCategory;
            });

        displayPrices(filteredPrices);
    }

    priceSearchButton.addEventListener(
        "click",
        searchPrices
    );

    priceSearch.addEventListener(
        "input",
        searchPrices
    );

    priceCategory.addEventListener(
        "change",
        searchPrices
    );

    loadPrices();
}