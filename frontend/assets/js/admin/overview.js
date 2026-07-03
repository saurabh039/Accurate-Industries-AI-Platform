async function loadDashboardStats() {

    try {

        const products =
            await fetch(`${API_BASE}/products`)
            .then(r => r.json());

        const inquiries =
            await fetch(`${API_BASE}/inquiries`)
            .then(r => r.json());

        document.getElementById(
            "total-products"
        ).innerText =
            products.length;

        document.getElementById(
            "total-inquiries"
        ).innerText =
            inquiries.length;

        const pending =
            inquiries.filter(
                i => i.status !== "Completed"
            ).length;

        const completed =
            inquiries.filter(
                i => i.status === "Completed"
            ).length;

        document.getElementById(
            "pending-inquiries"
        ).innerText =
            pending;

        document.getElementById(
            "completed-inquiries"
        ).innerText =
            completed;

        const badge =
            document.getElementById(
                "inquiry-badge"
            );

        if (badge) {

            badge.innerText = pending;
        }

    } catch (err) {

        console.error(
            "Dashboard stats error:",
            err
        );

    }

}


async function loadRecentActivity() {

    const container =
        document.getElementById(
            "recent-activity"
        );

    const inquiries =
        await fetch(`${API_BASE}/inquiries`)
        .then(r => r.json());

    container.innerHTML = "";

    inquiries
        .slice(-5)
        .reverse()
        .forEach(i => {

            container.innerHTML += `

            <div class="activity-item">

                <b>${i.name}</b>

                submitted an inquiry

                <br>

                <small>
                    ${i.status}
                </small>

            </div>

            `;

        });

}


async function loadAISummary() {

    const box =
        document.getElementById(
            "ai-summary"
        );

    const inquiries =
        await fetch(`${API_BASE}/inquiries`)
        .then(r => r.json());

    const pending =
        inquiries.filter(
            i => i.status !== "Completed"
        ).length;

    const totalProducts =
        inquiries
        .flatMap(i => i.products || [])
        .length;

    box.innerHTML = `

    <li>
        🔥 ${pending} pending inquiries require attention.
    </li>

    <li>
        📦 ${totalProducts} products have been requested by customers.
    </li>

    <li>
        🤖 AI lead scoring and demand forecasting
        will be activated in Milestone 4.
    </li>

    `;
}

window.onload = async () => {

    await loadDashboardStats();

    await loadAISummary();

    await loadRecentActivity();

};