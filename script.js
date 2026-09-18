"use strict";


/* ================================
   PRODUCT DATA
================================ */

const products = [

    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 2499,
        rating: 4.8,
        icon: "🎧",
        description:
            "Comfortable wireless headphones with clear and powerful sound."
    },

    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 3999,
        rating: 4.7,
        icon: "⌚",
        description:
            "Track activities, notifications and daily performance."
    },

    {
        id: 3,
        name: "Bluetooth Speaker",
        category: "electronics",
        price: 1799,
        rating: 4.4,
        icon: "🔊",
        description:
            "Portable speaker with powerful audio and long battery life."
    },

    {
        id: 4,
        name: "Laptop Stand",
        category: "electronics",
        price: 1299,
        rating: 4.5,
        icon: "💻",
        description:
            "Ergonomic stand designed for comfortable desk work."
    },

    {
        id: 5,
        name: "Classic Backpack",
        category: "fashion",
        price: 1299,
        rating: 4.5,
        icon: "🎒",
        description:
            "Durable backpack suitable for college, work and travel."
    },

    {
        id: 6,
        name: "Running Shoes",
        category: "fashion",
        price: 2499,
        rating: 4.7,
        icon: "👟",
        description:
            "Lightweight shoes designed for everyday comfort."
    },

    {
        id: 7,
        name: "Cotton Hoodie",
        category: "fashion",
        price: 999,
        rating: 4.3,
        icon: "👕",
        description:
            "Soft and comfortable hoodie for casual everyday wear."
    },

    {
        id: 8,
        name: "Desk Lamp",
        category: "home",
        price: 899,
        rating: 4.2,
        icon: "💡",
        description:
            "Modern desk lamp suitable for study and work."
    },

    {
        id: 9,
        name: "Coffee Maker",
        category: "home",
        price: 3499,
        rating: 4.6,
        icon: "☕",
        description:
            "Easy-to-use coffee maker for your home."
    },

    {
        id: 10,
        name: "Decorative Plant",
        category: "home",
        price: 599,
        rating: 4.1,
        icon: "🌿",
        description:
            "Simple decorative plant for your room or workspace."
    },

    {
        id: 11,
        name: "Sunglasses",
        category: "accessories",
        price: 799,
        rating: 4.5,
        icon: "🕶️",
        description:
            "Stylish sunglasses suitable for everyday outdoor use."
    },

    {
        id: 12,
        name: "Leather Wallet",
        category: "accessories",
        price: 699,
        rating: 4.4,
        icon: "👛",
        description:
            "Compact wallet with multiple card compartments."
    }

];


/* ================================
   ELEMENTS
================================ */

const productGrid =
    document.getElementById("productGrid");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const priceRange =
    document.getElementById("priceRange");

const priceValue =
    document.getElementById("priceValue");

const ratingFilter =
    document.getElementById("ratingFilter");

const sortSelect =
    document.getElementById("sortSelect");

const resultCount =
    document.getElementById("resultCount");

const noResults =
    document.getElementById("noResults");

const clearFilters =
    document.getElementById("clearFilters");

const resetSearch =
    document.getElementById("resetSearch");

const themeButton =
    document.getElementById("themeButton");

const cartButton =
    document.getElementById("cartButton");

const closeCart =
    document.getElementById("closeCart");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const emptyCart =
    document.getElementById("emptyCart");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutButton =
    document.getElementById("checkoutButton");

const productModal =
    document.getElementById("productModal");

const modalBody =
    document.getElementById("modalBody");

const closeModal =
    document.getElementById("closeModal");

const toast =
    document.getElementById("toast");


/* ================================
   STATE
================================ */

let cart = loadCart();

let searchTimer = null;


/* ================================
   LOCAL STORAGE
================================ */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                "shopSphereCart"
            );

        return saved
            ? JSON.parse(saved)
            : [];

    } catch (error) {

        return [];

    }

}


function saveCart() {

    try {

        localStorage.setItem(
            "shopSphereCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.log(
            "Local storage unavailable."
        );

    }

}


/* ================================
   PRODUCT DISPLAY
================================ */

function renderProducts(list) {

    productGrid.innerHTML = "";

    resultCount.textContent =
        list.length + " Products";


    if (list.length === 0) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    const fragment =
        document.createDocumentFragment();


    list.forEach(function (product) {

        const card =
            document.createElement("article");

        card.className =
            "product-card";


        card.innerHTML = `

            <div
                class="product-image"
                aria-label="${product.name}"
                role="img"
            >
                ${product.icon}
            </div>

            <div class="product-content">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-meta">

                    <span class="product-price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <span class="product-rating">
                        ★ ${product.rating}
                    </span>

                </div>

                <div class="product-buttons">

                    <button
                        class="add-cart"
                        data-action="add"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                    <button
                        class="view-button"
                        data-action="view"
                        data-id="${product.id}"
                    >
                        Details
                    </button>

                </div>

            </div>
        `;


        fragment.appendChild(card);

    });


    productGrid.appendChild(fragment);

}


/* ================================
   FILTER + SORT
================================ */

function getFilteredProducts() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const category =
        categoryFilter.value;

    const maximumPrice =
        Number(priceRange.value);

    const minimumRating =
        Number(ratingFilter.value);


    let result =
        products.filter(function (product) {

            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(search);


            const categoryMatch =
                category === "all" ||
                product.category === category;


            const priceMatch =
                product.price <= maximumPrice;


            const ratingMatch =
                product.rating >= minimumRating;


            return (
                searchMatch &&
                categoryMatch &&
                priceMatch &&
                ratingMatch
            );

        });


    const sort =
        sortSelect.value;


    if (sort === "price-low") {

        result.sort(function (a, b) {

            return a.price - b.price;

        });

    }


    if (sort === "price-high") {

        result.sort(function (a, b) {

            return b.price - a.price;

        });

    }


    if (sort === "rating") {

        result.sort(function (a, b) {

            return b.rating - a.rating;

        });

    }


    if (sort === "name") {

        result.sort(function (a, b) {

            return a.name.localeCompare(
                b.name
            );

        });

    }


    return result;

}


function updateProducts() {

    renderProducts(
        getFilteredProducts()
    );

}


/* ================================
   CART
================================ */

function addToCart(id) {

    const product =
        products.find(function (item) {

            return item.id === id;

        });


    if (!product) {
        return;
    }


    cart.push(product);

    saveCart();

    updateCart();

    showToast(
        product.name + " added to cart ✓"
    );

}


function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


function updateCart() {

    cartItems.innerHTML = "";

    cartCount.textContent =
        cart.length;


    if (cart.length === 0) {

        emptyCart.style.display =
            "block";

        cartTotal.textContent =
            "0";

        return;

    }


    emptyCart.style.display =
        "none";


    let total = 0;


    const fragment =
        document.createDocumentFragment();


    cart.forEach(function (product, index) {

        total += product.price;


        const item =
            document.createElement("div");

        item.className =
            "cart-item";


        item.innerHTML = `

            <div class="cart-item-image">
                ${product.icon}
            </div>

            <div>

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ₹${product.price.toLocaleString("en-IN")}
                </p>

            </div>

            <button
                class="remove-cart"
                data-index="${index}"
            >
                Remove
            </button>
        `;


        fragment.appendChild(item);

    });


    cartItems.appendChild(fragment);


    cartTotal.textContent =
        total.toLocaleString("en-IN");

}


function openCart() {

    cartDrawer.classList.add("open");

    cartOverlay.classList.remove("hidden");

}


function closeCartDrawer() {

    cartDrawer.classList.remove("open");

    cartOverlay.classList.add("hidden");

}


/* ================================
   PRODUCT DETAILS
================================ */

function openProductDetails(id) {

    const product =
        products.find(function (item) {

            return item.id === id;

        });


    if (!product) {
        return;
    }


    modalBody.innerHTML = `

        <div class="modal-product">

            <div class="modal-product-icon">
                ${product.icon}
            </div>

            <span class="product-category">
                ${product.category}
            </span>

            <h2>
                ${product.name}
            </h2>

            <p>
                ${product.description}
            </p>

            <h2>
                ₹${product.price.toLocaleString("en-IN")}
            </h2>

            <p>
                ⭐ ${product.rating}/5 rating
            </p>

            <button
                class="primary-button"
                id="modalAddButton"
            >
                Add to Cart
            </button>

        </div>
    `;


    productModal.classList.remove("hidden");


    document
        .getElementById("modalAddButton")
        .addEventListener(
            "click",
            function () {

                addToCart(product.id);

                closeProductModal();

            }
        );

}


function closeProductModal() {

    productModal.classList.add("hidden");

}


/* ================================
   THEME
================================ */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "shopSphereTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }

}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "shopSphereTheme",
        isDark ? "dark" : "light"
    );

}


/* ================================
   TOAST
================================ */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(function () {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


/* ================================
   RESET FILTERS
================================ */

function resetFilters() {

    searchInput.value = "";

    categoryFilter.value =
        "all";

    priceRange.value =
        "5000";

    priceValue.textContent =
        "5000";

    ratingFilter.value =
        "0";

    sortSelect.value =
        "recommended";

    updateProducts();

}


/* ================================
   EVENTS
================================ */


/* Product event delegation */

productGrid.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {
            return;
        }


        const id =
            Number(button.dataset.id);

        const action =
            button.dataset.action;


        if (action === "add") {

            addToCart(id);

        }


        if (action === "view") {

            openProductDetails(id);

        }

    }
);


/* Search - debounced */

searchInput.addEventListener(
    "input",
    function () {

        clearTimeout(searchTimer);


        searchTimer =
            setTimeout(
                updateProducts,
                180
            );

    }
);


categoryFilter.addEventListener(
    "change",
    updateProducts
);


priceRange.addEventListener(
    "input",
    function () {

        priceValue.textContent =
            priceRange.value;

        updateProducts();

    }
);


ratingFilter.addEventListener(
    "change",
    updateProducts
);


sortSelect.addEventListener(
    "change",
    updateProducts
);


clearFilters.addEventListener(
    "click",
    resetFilters
);


resetSearch.addEventListener(
    "click",
    resetFilters
);


/* Cart */

cartButton.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartDrawer
);


cartOverlay.addEventListener(
    "click",
    closeCartDrawer
);


/* Remove cart item */

cartItems.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".remove-cart"
            );


        if (!button) {
            return;
        }


        const index =
            Number(button.dataset.index);

        removeFromCart(index);

    }
);


/* Modal */

closeModal.addEventListener(
    "click",
    closeProductModal
);


productModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === productModal
        ) {

            closeProductModal();

        }

    }
);


/* Theme */

themeButton.addEventListener(
    "click",
    toggleTheme
);


/* Checkout */

checkoutButton.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {

            showToast(
                "Your cart is empty."
            );

            return;

        }


        showToast(
            "Demo checkout completed ✓"
        );

    }
);


/* Keyboard accessibility */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeCartDrawer();

            closeProductModal();

        }

    }
);


/* ================================
   INITIALIZE APP
================================ */

loadTheme();

updateProducts();

updateCart();