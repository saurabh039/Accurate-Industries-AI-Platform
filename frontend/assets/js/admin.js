const API_BASE = "http://127.0.0.1:8000";

/* ================= AUTH ================= */

function getToken() {
    return localStorage.getItem("token");
}

if (!getToken()) {
    alert("Please login first");
    window.location.href = "admin-login.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "admin-login.html";
}

/* ================= ADD PRODUCT ================= */

async function addProduct() {

    const token = getToken();

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const subcategory = document.getElementById("subcategory").value;
    const fileInput = document.getElementById("image");

    if (
        !name ||
        !description ||
        !category ||
        !subcategory ||
        !fileInput.files.length
    ) {
        alert("Fill all fields properly");
        return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("file", fileInput.files[0]);

    try {

        const res = await fetch(`${API_BASE}/add-product`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.detail || "Error");
            return;
        }

        alert("✅ Product added successfully");

        clearForm();

        await loadProducts();

        await updateDashboardStats();

    } catch (err) {

        console.error(err);

    }
}

/* ================= CLEAR FORM ================= */

function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
    document.getElementById("category").value = "";

    document.getElementById("subcategory").innerHTML =
        `<option value="">Select Subcategory</option>`;
}

/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {

    try {

        const res = await fetch(`${API_BASE}/products`);

        const data = await res.json();

        const container = document.getElementById("products");

        container.innerHTML = "";

        data.forEach(p => {

            const imageUrl = p.image_url
                ? `${API_BASE}/${p.image_url}`
                : "https://via.placeholder.com/400x300";

            container.innerHTML += `

            <div class="product-card">

                <div class="product-img">
                    <img src="${imageUrl}" alt="${p.name}">
                </div>

                <div class="product-content">

                    <h3>${p.name}</h3>

                    <p>${p.description}</p>

                    <div class="tags">

                        <span class="tag category">
                            ${p.category}
                        </span>

                        <span class="tag subcategory">
                            ${p.subcategory}
                        </span>

                    </div>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${p.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>

            `;
        });

    } catch (err) {

        console.error(err);

    }
}

/* ================= DELETE PRODUCT ================= */

async function deleteProduct(id) {

    if (!confirm("Delete product?")) return;

    try {

        await fetch(`${API_BASE}/delete-product/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        await loadProducts();

        await updateDashboardStats();

    } catch (err) {

        console.error(err);

    }
}

/* ================= LOAD INQUIRIES ================= */

async function loadInquiries() {

    const container = document.getElementById("inquiry-list");

    container.innerHTML = "Loading...";

    try {

        const res = await fetch(`${API_BASE}/inquiries`);

        const data = await res.json();

        container.innerHTML = "";

        data.forEach(inq => {

            const div = document.createElement("div");

            div.className = "inquiry-card";

            div.innerHTML = `

                <div class="inq-header">

                    <h3>${inq.name}</h3>

                    <span class="status ${
                        inq.status === "Completed"
                        ? "completed"
                        : "pending"
                    }">

                        ${inq.status}

                    </span>

                </div>

                <div class="inq-body">

                    <p><b>Email:</b> ${inq.email || "—"}</p>

                    <p><b>Phone:</b> ${inq.phone || "—"}</p>

                    <p><b>Message:</b> ${inq.message || "—"}</p>

                    <ul class="product-list">

                        ${
                            
                            inq.products.length
                            ? inq.products
                                .map(
                                    p => `
                                    <li>
                                        • ${p.name}
                                        <span class="qty-badge">
                                            × ${p.quantity}
                                        </span>
                                    </li>
                                    `
                                )
                                .join("")
                            : "<li>• No products selected</li>"
                        }

                    </ul>

                </div>

                <div class="inq-actions">

                    ${
                        inq.status === "Pending"
                        ? `
                        <button
                            class="done-btn"
                            onclick="markDone(${inq.id})"
                        >
                            Done
                        </button>
                        `
                        : `
                        <span class="done-label">
                            Completed
                        </span>
                        `
                    }

                    <button
                        class="delete-btn"
                        onclick="deleteInquiry(${inq.id})"
                    >
                        Delete
                    </button>

                </div>
            `;

            container.appendChild(div);
        });

    } catch (err) {

        console.error(err);

    }
}

/* ================= MARK DONE ================= */

async function markDone(id) {

    try {

        await fetch(
            `${API_BASE}/update-inquiry-status/${id}?status=Completed`,
            {
                method: "PUT"
            }
        );

        await loadInquiries();

        await updateDashboardStats();

    } catch (err) {

        console.error(err);

    }
}

/* ================= DELETE INQUIRY ================= */

async function deleteInquiry(id) {

    if (!confirm("Delete inquiry?")) return;

    try {

        await fetch(`${API_BASE}/delete-inquiry/${id}`, {
            method: "DELETE"
        });

        await loadInquiries();

        await updateDashboardStats();

    } catch (err) {

        console.error(err);

    }
}

/* ================= DASHBOARD STATS ================= */

async function updateDashboardStats() {

    try {

        const productsRes = await fetch(`${API_BASE}/products`);

        const products = await productsRes.json();

        document.getElementById("total-products").innerText =
            products.length;

        const inquiryRes = await fetch(`${API_BASE}/inquiries`);

        const inquiries = await inquiryRes.json();

        document.getElementById("total-inquiries").innerText =
            inquiries.length;

        const pending = inquiries.filter(
            i => i.status !== "Completed"
        ).length;

        const completed = inquiries.filter(
            i => i.status === "Completed"
        ).length;

        document.getElementById("pending-inquiries").innerText =
            pending;

        document.getElementById("completed-inquiries").innerText =
            completed;

        document.getElementById("inquiry-badge").innerText =
            pending;

    } catch (err) {

        console.error(err);

    }
}

/* ================= SUBCATEGORY ================= */

const subcategoryMap = {

    Machinery: [
        "VMC",
        "CNC Turning",
        "Lathe",
        "Power Press",
        "Milling",
        "Grinding"
    ],

    Instruments: [
        "Measuring"
    ],

    Fixtures: [
        "Hydraulic",
        "Jig",
        "Pneumatic",
        "Inspection"
    ],

    Dies: [
        "Forging",
        "Press",
        "Bending",
        "Cutting"
    ]
};

function loadSubcategories() {

    const category =
        document.getElementById("category").value;

    const subSelect =
        document.getElementById("subcategory");

    subSelect.innerHTML =
        `<option value="">Select Subcategory</option>`;

    if (!subcategoryMap[category]) return;

    subcategoryMap[category].forEach(sub => {

        const option = document.createElement("option");

        option.value = sub;

        option.textContent = sub;

        subSelect.appendChild(option);
    });
}

/* ================= INIT ================= */

window.onload = async () => {

    await loadProducts();

    await loadInquiries();

    await updateDashboardStats();
};

/* ================= AUTO REFRESH ================= */

setInterval(async () => {

    await updateDashboardStats();

}, 3000);