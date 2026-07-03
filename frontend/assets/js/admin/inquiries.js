const API_BASE = "http://127.0.0.1:8000";

async function loadInquiries() {

    const pendingContainer =
        document.getElementById("pending-list");

    const completedContainer =
        document.getElementById("completed-list");

    pendingContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    try {

        const inquiries = await fetch(
            `${API_BASE}/inquiries`
        ).then(r => r.json());

        let pendingCount = 0;

        inquiries.forEach(inq => {

            if (inq.status !== "Completed") {
                pendingCount++;
            }

            const card = createInquiryCard(inq);

            if (inq.status === "Completed") {

                completedContainer.appendChild(card);

            } else {

                pendingContainer.appendChild(card);
            }

        });

        document.getElementById(
            "inquiry-badge"
        ).innerText = pendingCount;

    }

    catch (err) {

        console.error(err);

    }

}



function createInquiryCard(inq) {

    const div =
        document.createElement("div");

    div.className =
        "inquiry-card";

    div.innerHTML = `

        <h3>${inq.name}</h3>

        <p><b>Email:</b> ${inq.email}</p>

        <p><b>Phone:</b> ${inq.phone}</p>

        <p><b>Message:</b> ${inq.message}</p>

        <ul class="product-list">

            ${
                inq.products.length
                ?

                inq.products.map(

                    p => `

                    <li>

                        ${p.name}

                        <span class="qty-badge">

                            × ${p.quantity}

                        </span>

                    </li>

                    `

                ).join("")

                :

                "<li>No products selected</li>"
            }

        </ul>

        <div class="inquiry-actions">

            ${
                inq.status !== "Completed"

                ?

                `

                <button
                class="done-btn"
                onclick="markDone(${inq.id})">

                    Done

                </button>

                `

                :

                `
                <span class="completed-text">
                    Completed
                </span>
                `
            }

            <button
            class="delete-btn"
            onclick="deleteInquiry(${inq.id})">

                Delete

            </button>

        </div>

    `;

    return div;
}



async function markDone(id) {

    await fetch(

        `${API_BASE}/update-inquiry-status/${id}?status=Completed`,

        {
            method: "PUT"
        }

    );

    loadInquiries();
}



async function deleteInquiry(id) {

    if (!confirm("Delete inquiry?"))
        return;

    await fetch(

        `${API_BASE}/delete-inquiry/${id}`,

        {
            method: "DELETE"
        }

    );

    loadInquiries();
}



function filterInquiries() {

    const search =

        document
        .getElementById("searchInquiry")
        .value
        .toLowerCase();

    const cards =

        document.querySelectorAll(
            ".inquiry-card"
        );

    cards.forEach(card => {

        card.style.display =

            card.innerText
            .toLowerCase()
            .includes(search)

            ?

            "block"

            :

            "none";

    });

}



window.onload = () => {

    loadInquiries();

};