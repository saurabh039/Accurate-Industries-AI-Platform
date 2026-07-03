
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

    } catch (err) {

        console.error(err);

    }
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

                        <span class="tag ai-tag">
                            🤖 AI Tagged
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

    } catch (err) {

        console.error(err);

    }
}


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

/* ================= CLEAR FORM ================= */

function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
    document.getElementById("category").value = "";

    document.getElementById("subcategory").innerHTML =
        `<option value="">Select Subcategory</option>`;
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

function searchProducts() {

    const value =
        document
        .getElementById("search-input")
        .value
        .toLowerCase();

    const cards =
        document.querySelectorAll(
            ".product-card"
        );

    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        card.style.display =
            text.includes(value)
            ? "block"
            : "none";

    });

}

window.onload = async () => {

    await loadProducts();

};