console.log("✅ MAIN.JS LOADED");


/* =========================================
   API BASE
========================================= */

const API_BASE = "http://127.0.0.1:8000";


/* =========================================
   GLOBAL TOAST
========================================= */

function showToast(msg, type = "success") {

    document
        .querySelectorAll(".global-toast")
        .forEach(t => t.remove());

    const toast =
        document.createElement("div");

    toast.className =
        `global-toast ${type}`;

    let icon = "✓";

    if (type === "error") {
        icon = "✕";
    }

    if (type === "warning") {
        icon = "!";
    }

    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div class="toast-text">
            ${msg}
        </div>

    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        toast.classList.add("hide");

        setTimeout(() => {

            if (toast.parentNode) {

                toast.parentNode.removeChild(toast);

            }

        }, 300);

    }, 2400);
}


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartCount() {

    const countEl =
        document.getElementById("cart-count");

    if (!countEl) return;

    const products =
        JSON.parse(
            localStorage.getItem(
                "inquiryProducts"
            )
        ) || [];

    countEl.textContent =
        products.length;
}


/* =========================================
   REMOVE PRODUCT
========================================= */

function removeSelectedProduct(id) {

    let products =
        JSON.parse(
            localStorage.getItem(
                "inquiryProducts"
            )
        ) || [];

    products =
        products.filter(
            p => p.id !== id
        );

    localStorage.setItem(
        "inquiryProducts",
        JSON.stringify(products)
    );

    renderSelectedProducts();

    updateCartCount();

    showToast(
        "Product removed",
        "warning"
    );
}

/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(id, change) {

    let products =
        JSON.parse(
            localStorage.getItem(
                "inquiryProducts"
            )
        ) || [];

    const product =
        products.find(
            p => p.id === id
        );

    if (!product) return;

    product.quantity += change;

    if (product.quantity < 1) {

        product.quantity = 1;
    }

    localStorage.setItem(

        "inquiryProducts",

        JSON.stringify(products)

    );

    renderSelectedProducts();
}

/* =========================================
   RENDER SELECTED PRODUCTS
========================================= */

function renderSelectedProducts() {

    const container =
        document.getElementById(
            "selected-products"
        );

    if (!container) return;

    const products =
        JSON.parse(
            localStorage.getItem(
                "inquiryProducts"
            )
        ) || [];

    // EMPTY STATE

    if (!products.length) {

        container.innerHTML = `

            <div class="empty-selected">

                No products selected

            </div>

        `;

        return;
    }

    // CLEAR OLD

    container.innerHTML = "";

    // RENDER ITEMS

    products.forEach(product => {

        const div =
            document.createElement("div");

        div.className =
            "selected-item";

        div.innerHTML = `

        <div class="selected-left">

            <span class="selected-name">

                ${product.name}

            </span>

            <div class="quantity-controls">

                <button
                    onclick="changeQuantity(${product.id}, -1)">

                    −

                </button>

                <span>

                    ${product.quantity}

                </span>

                <button
                    onclick="changeQuantity(${product.id}, 1)">

                    +

                </button>

            </div>

        </div>

        <button
            class="remove-selected-btn"
            onclick="removeSelectedProduct(${product.id})">

            Remove

        </button>

        `;

        container.appendChild(div);
    });
}


/* =========================================
   VALIDATION
========================================= */

function validateForm(
    name,
    email,
    phone,
    message,
    products
) {

    if (!name || name.length < 2) {

        showToast(
            "Enter valid name",
            "warning"
        );

        return false;
    }

    if (!email || !email.includes("@")) {

        showToast(
            "Enter valid email",
            "warning"
        );

        return false;
    }

    if (!phone || phone.length < 10) {

        showToast(
            "Enter valid phone number",
            "warning"
        );

        return false;
    }

    if (!message || message.length < 5) {

        showToast(
            "Enter proper requirement",
            "warning"
        );

        return false;
    }

    if (products.length === 0) {

        showToast(
            "Select at least one product",
            "warning"
        );

        return false;
    }

    return true;
}


/* =========================================
   SUBMIT INQUIRY
========================================= */

async function submitInquiry() {

    try {

        const name =
            document
                .getElementById("name")
                ?.value
                .trim();

        const email =
            document
                .getElementById("email")
                ?.value
                .trim();

        const phone =
            document
                .getElementById("phone")
                ?.value
                .trim();

        const message =
            document
                .getElementById("message")
                ?.value
                .trim();

        const products =
            JSON.parse(
                localStorage.getItem(
                    "inquiryProducts"
                )
            ) || [];

        if (

            !validateForm(
                name,
                email,
                phone,
                message,
                products
            )

        ) return;

        const res =
            await fetch(

                `${API_BASE}/submit-inquiry`,

                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                    name,
                    email,
                    phone,
                    message,

                    products: products.map(p => ({

                        product_id: p.id,
                        quantity: p.quantity

                    }))

                })
                }
            );

        const data =
            await res.json();

        if (!res.ok) {

            console.error(data);

            showToast(
                data.detail?.[0]?.msg ||
                "Submission failed",
                "error"
            );

            return;
        }

        showToast(
            "Inquiry submitted successfully 🚀",
            "success"
        );

        // CLEAR STORAGE

        localStorage.removeItem(
            "inquiryProducts"
        );

        // CLEAR FORM

        document.getElementById(
            "name"
        ).value = "";

        document.getElementById(
            "email"
        ).value = "";

        document.getElementById(
            "phone"
        ).value = "";

        document.getElementById(
            "message"
        ).value = "";

        renderSelectedProducts();

        updateCartCount();

    } catch (err) {

        console.error(err);

        showToast(
            "Server error",
            "error"
        );
    }
}


/* =========================================
   NAVBAR SCROLL EFFECT
========================================= */

window.addEventListener(
    "scroll",
    () => {

        const navbar =
            document.querySelector(
                ".navbar"
            );

        if (!navbar) return;

        if (window.scrollY > 80) {

            navbar.classList.add(
                "fixed"
            );

        } else {

            navbar.classList.remove(
                "fixed"
            );
        }
    }
);


/* =========================================
   INIT
========================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        renderSelectedProducts();

    }
);