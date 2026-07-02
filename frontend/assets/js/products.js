const API_URL = "http://127.0.0.1:8000/products";

let allProducts = [];
let currentCategory = "all";
let currentSubcategory = "all";

/* =========================================
   LOAD PRODUCTS
========================================= */

async function loadProducts() {

    try {

        const res = await fetch(API_URL);

        const data = await res.json();

        allProducts = data;

        generateCategories();

        displayProducts();

    } catch (err) {

        console.error(err);

        document.getElementById("products-container").innerHTML = `
            <div class="no-products">
                Failed to load products
            </div>
        `;
    }
}

/* =========================================
   CATEGORY FILTER
========================================= */

function generateCategories() {

    const container =
        document.getElementById("category-filter");

    const categories = [
        "all",
        ...new Set(allProducts.map(p => p.category))
    ];

    container.innerHTML = "";

    categories.forEach(cat => {

        const btn = document.createElement("button");

        btn.textContent = cat;

        if (cat === currentCategory) {
            btn.classList.add("active");
        }

        btn.onclick = () => {

            currentCategory = cat;

            currentSubcategory = "all";

            document
                .querySelectorAll("#category-filter button")
                .forEach(btn => btn.classList.remove("active"));

            btn.classList.add("active");

            generateSubcategories();

            displayProducts();
        };

        container.appendChild(btn);
    });
}

/* =========================================
   SUBCATEGORY FILTER
========================================= */

function generateSubcategories() {

    const container =
        document.getElementById("subcategory-filter");

    if (currentCategory === "all") {

        container.innerHTML = "";

        return;
    }

    const subs = [

        "all",

        ...new Set(

            allProducts
                .filter(
                    p => p.category === currentCategory
                )
                .map(
                    p => p.subcategory
                )

        )
    ];

    container.innerHTML = "";

    subs.forEach(sub => {

        const btn =
            document.createElement("button");

        btn.textContent = sub;

        if (sub === currentSubcategory) {
            btn.classList.add("active");
        }

        btn.onclick = () => {

            currentSubcategory = sub;

            document
                .querySelectorAll(
                    "#subcategory-filter button"
                )
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            btn.classList.add("active");

            displayProducts();
        };

        container.appendChild(btn);
    });
}

/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts() {

    const container =
        document.getElementById("products-container");

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    container.innerHTML = "";

    const filtered =
        allProducts.filter(product => {

            return (

                (
                    currentCategory === "all" ||
                    product.category === currentCategory
                )

                &&

                (
                    currentSubcategory === "all" ||
                    product.subcategory === currentSubcategory
                )

                &&

                product.name
                    .toLowerCase()
                    .includes(search)

            );
        });

    if (!filtered.length) {

        container.innerHTML = `
            <div class="no-products">
                No products found
            </div>
        `;

        return;
    }

    filtered.forEach(product => {

        let imageUrl =
            product.image_url
                ? `http://127.0.0.1:8000/${product.image_url}`
                : "https://via.placeholder.com/400";

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image-wrap">

                <img
                    src="${imageUrl}"
                    alt="${product.name}"
                    onclick="openImageModal('${imageUrl}')"
                >

            </div>

            <div class="product-card-content">

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="card-tags">
                    <span>${product.category}</span>
                    <span>${product.subcategory}</span>
                </div>

                <div class="card-buttons">

                    <button
                        class="quick-btn"
                        onclick="openQuickView(${product.id})">

                        👁 Quick View

                    </button>

                    <button
                        class="add-btn"
                        onclick="addToInquiry(${product.id}, '${product.name}')">

                        Add to Inquiry

                    </button>

                </div>

            </div>

        `;

        container.appendChild(card);
    });
}

/* =========================================
   QUICK VIEW
========================================= */

function openQuickView(id) {

    const product =
        allProducts.find(
            p => p.id === id
        );

    if (!product) return;

    let imageUrl =
        product.image_url.startsWith("http")

        ? product.image_url

        : `http://127.0.0.1:8000/${product.image_url}`;

    document.getElementById("quick-img").src = imageUrl;

    document.getElementById("quick-name").innerText =
        product.name;

    document.getElementById("quick-desc").innerText =
        product.description;

    document.getElementById("quick-tags").innerHTML = `
        <span class="tag">${product.category}</span>
        <span class="tag">${product.subcategory}</span>
    `;

    document.getElementById("quick-add").onclick = () =>
        addToInquiry(product.id, product.name);

    document.getElementById("quickViewModal").style.display =
        "flex";
}

/* =========================================
   IMAGE MODAL
========================================= */

function openImageModal(src) {

    const modal =
        document.getElementById("imageModal");

    const modalImg =
        document.getElementById("modalImg");

    modal.style.display = "block";

    modalImg.src = src;
}

/* =========================================
   CLOSE MODALS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* QUICK MODAL */

    const quickModal =
        document.getElementById("quickViewModal");

    const closeQuick =
        document.querySelector(".close-quick");

    if (closeQuick) {

        closeQuick.onclick = () => {
            quickModal.style.display = "none";
        };
    }

    quickModal.onclick = e => {

        if (e.target === quickModal) {
            quickModal.style.display = "none";
        }
    };

    /* IMAGE MODAL */

    const imageModal =
        document.getElementById("imageModal");

    const closeImage =
        document.querySelector(".close-modal");

    if (closeImage) {

        closeImage.onclick = () => {
            imageModal.style.display = "none";
        };
    }

    imageModal.onclick = e => {

        if (e.target === imageModal) {
            imageModal.style.display = "none";
        }
    };
});

/* =========================================
   SEARCH
========================================= */

document
    .getElementById("search")
    .addEventListener("input", displayProducts);

/* =========================================
   NOTIFICATIONS
========================================= */

function showNotification(message, type = "success") {

    document
        .querySelectorAll(".top-notification")
        .forEach(n => n.remove());

    const notification =
        document.createElement("div");

    notification.className =
        `top-notification ${type}`;

    let icon = "✓";

    if (type === "warning") {
        icon = "!";
    }

    if (type === "remove") {
        icon = "✕";
    }

    notification.innerHTML = `

        <div class="notify-icon">
            ${icon}
        </div>

        <div class="notify-text">
            ${message}
        </div>

    `;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    setTimeout(() => {

        notification.classList.remove("show");

        notification.classList.add("hide");

        setTimeout(() => {

            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }

        }, 400);

    }, 2200);
}

/* =========================================
   STORAGE
========================================= */

function getInquiryProducts() {

    return JSON.parse(
        localStorage.getItem("inquiryProducts")
    ) || [];
}

function saveInquiryProducts(products) {

    localStorage.setItem(
        "inquiryProducts",
        JSON.stringify(products)
    );

    updateCartCount();
}

/* =========================================
   ADD TO INQUIRY
========================================= */

function addToInquiry(id, name) {

    let products =
        getInquiryProducts();

    const exists =
        products.find(
            p => p.id === id
        );

    if (exists) {

        showNotification(
            "Product already added",
            "warning"
        );

        return;
    }

    products.push({
        id,
        name,
        quantity: 1
    });

    saveInquiryProducts(products);

    renderSelectedProducts();

    showNotification(
        `${name} added to inquiry`,
        "success"
    );
}

/* =========================================
   REMOVE
========================================= */

function removeFromInquiry(id) {

    let products = getInquiryProducts();

    products = products.filter(
        p => p.id !== id
    );

    saveInquiryProducts(products);

    renderSelectedProducts();

    showNotification(
        "Product removed from inquiry",
        "remove"
    );
}


function increaseQuantity(id) {

    let products = getInquiryProducts();

    const product = products.find(
        p => p.id === id
    );

    if (product) {
        product.quantity++;
    }

    saveInquiryProducts(products);

    renderSelectedProducts();
}


function decreaseQuantity(id) {

    let products = getInquiryProducts();

    const product = products.find(
        p => p.id === id
    );

    if (!product) return;

    if (product.quantity > 1) {

        product.quantity--;

    } else {

        products =
            products.filter(
                p => p.id !== id
            );
    }

    saveInquiryProducts(products);

    renderSelectedProducts();
}

/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {

    const count =
        getInquiryProducts().length;

    const cart =
        document.getElementById("cart-count");

    if (cart) {
        cart.innerText = count;
    }
}

/* =========================================
   SELECTED PRODUCTS
========================================= */

function renderSelectedProducts() {

    const container =
        document.getElementById(
            "selected-products"
        );

    if (!container) return;

    const products =
        getInquiryProducts();

    if (!products.length) {

        container.innerHTML = `
            <div class="empty-selected">
                No products selected yet
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    products.forEach(product => {

        const div =
            document.createElement("div");

        div.className =
            "selected-item";

        div.innerHTML = `

            <div>

                <h4>${product.name}</h4>

                <button
                    onclick="decreaseQuantity(${product.id})">

                    −

                </button>

                <span>

                    ${product.quantity}

                </span>

                <button
                    onclick="increaseQuantity(${product.id})">

                    +

                </button>

            </div>

            <button
                onclick="removeFromInquiry(${product.id})">

                Remove

            </button>

        `;

        container.appendChild(div);
    });
}

/* =========================================
   INIT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    updateCartCount();

    renderSelectedProducts();
});