async function loadAnalytics() {

    const dashboard =
        await fetch(
            `${API_BASE}/analytics/dashboard`
        ).then(r => r.json());

    const customers =
        await fetch(
            `${API_BASE}/analytics/customers`
        ).then(r => r.json());

    const products =
        await fetch(
            `${API_BASE}/analytics/products`
        ).then(r => r.json());

    const kpis =
        await fetch(
            `${API_BASE}/analytics/kpis`
        ).then(r => r.json());


    // KPI CARDS

    document.getElementById(
        "analytics-inquiries"
    ).innerText =
        dashboard.total_inquiries;


    document.getElementById(
        "completion-rate"
    ).innerText =
        dashboard.completion_rate + "%";


    document.getElementById(
        "repeat-customers"
    ).innerText =
        dashboard.repeat_customers;


    document.getElementById(
        "avg-products"
    ).innerText =
        dashboard.average_products_per_inquiry;


    // CHARTS

    renderProductChart(products);

    renderCustomerChart(customers);

    renderCustomerPieChart(customers);

    renderBusinessKPIs(kpis);

    renderInsights(kpis);


}

function renderProductChart(products) {

    const canvas =
        document.getElementById(
            "product-demand-chart"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");


    const labels =
        products.map(
            item => item.product
        );


    const values =
        products.map(
            item => item.requests
        );


    new Chart(ctx, {

        type: "bar",

        data: {

            labels,

            datasets: [{

                label: "Requests",

                data: values,

                backgroundColor: "#2563eb",

                borderRadius: 8,

                maxBarThickness: 40

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    ticks: {

                        maxRotation: 45,

                        minRotation: 45

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        precision: 0
                    }

                }

            }

        }

    });

}

function renderCustomerChart(customers) {

    const container =
        document.getElementById(
            "top-customers"
        );

    if (!container) return;

    container.innerHTML = "";


    customers
        .slice(0, 5)
        .forEach(customer => {

            container.innerHTML += `

            <div class="chart-item">

                <span>

                    ${customer.customer}

                </span>

                <b>

                    ${customer.total_inquiries}
                    inquiries

                </b>

            </div>

            `;

        });

}

function renderForecastChart(data) {

    const canvas =
        document.getElementById(
            "forecast-chart"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");


    new Chart(ctx, {

        type: "bar",

        data: {

            labels:

                data.map(
                    item => item.product
                ),

            datasets: [{

                label: "Predicted Demand",

                data: data.map(
                    item => item.predicted_next_month
                ),

                backgroundColor: "#22c55e",

                borderRadius: 8,

                maxBarThickness: 35

            }]

        },

        options: {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

        legend: {

            display: true,

            position: "top"

        }

    },

    scales: {

        x: {

            ticks: {

                maxRotation: 45,

                minRotation: 45

            }

        },

        y: {

            beginAtZero: true

        }

    }

}

    });

}

function renderCustomerPieChart(customers) {

    const canvas =
        document.getElementById(
            "customer-pie-chart"
        );

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {

        type: "pie",

        data: {

            labels:

                customers
                .slice(0, 5)
                .map(c => c.customer),

            datasets: [{

                data:

                    customers
                    .slice(0, 5)
                    .map(c => c.total_inquiries),

                backgroundColor: [

                    "#2563eb",
                    "#f43f5e",
                    "#14b8a6",
                    "#f59e0b",
                    "#fbbf24"

                ],

                borderWidth: 2,

                borderColor: "#ffffff"

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: true,

            aspectRatio: 1,

            plugins: {

                legend: {

                    position: "right",

                    labels: {

                        boxWidth: 14,

                        padding: 20,

                        font: {

                            size: 14

                        }

                    }

                }

            }

        }

    });

}

function renderBusinessKPIs(kpis) {

    const container =
        document.getElementById(
            "inquiry-stats"
        );

    if (!container) return;


    container.innerHTML = `

        <div class="chart-item">

            <span>
                🏆 Top Product
            </span>

            <b>
                ${kpis.top_product}
            </b>

        </div>


        <div class="chart-item">

            <span>
                👤 Top Customer
            </span>

            <b>
                ${kpis.top_customer}
            </b>

        </div>


        <div class="chart-item">

            <span>
                📈 Completion Rate
            </span>

            <b>
                ${kpis.completion_rate}%
            </b>

        </div>


        <div class="chart-item">

            <span>
                🔄 Repeat Customers
            </span>

            <b>
                ${kpis.repeat_customers}
            </b>

        </div>

    `;

}



function renderInsights(kpis) {

    const container =
        document.getElementById(
            "business-insights"
        );

    if (!container) return;


    container.innerHTML = `

        <li>

            🔥 Most demanded product:

            <b>
                ${kpis.top_product}
            </b>

        </li>


        <li>

            👑 Most active customer:

            <b>
                ${kpis.top_customer}
            </b>

        </li>


        <li>

            📈 Completion rate:

            <b>
                ${kpis.completion_rate}%
            </b>

        </li>


        <li>

            🔁 Repeat customers:

            <b>
                ${kpis.repeat_customers}
            </b>

        </li>


        <li>

            📦 Customers request

            <b>
                ${kpis.avg_products_per_inquiry}
            </b>

            products per inquiry on average.

        </li>

    `;

}



async function loadSegments() {

    const segments =
        await fetch(
            `${API_BASE}/analytics/segments`
        ).then(r => r.json());

    const container =
        document.getElementById(
            "customer-segments"
        );

    if (!container) return;

    container.innerHTML = "";


    segments.forEach(item => {

        container.innerHTML += `

        <div class="chart-item">

            <span>

                ${item.customer}

            </span>

            <b>

                ${item.segment}

            </b>

        </div>

        `;

    });

}



async function loadLeadScores() {

    const leads =
        await fetch(
            `${API_BASE}/analytics/lead-scores`
        ).then(r => r.json());

    const container =
        document.getElementById(
            "lead-scores"
        );

    if (!container) return;

    container.innerHTML = "";


    leads.forEach(item => {

        container.innerHTML += `

        <div class="chart-item">

            <span>

                ${item.customer}

                <br>

                <small>

                    ${item.products}
                    products

                </small>

            </span>

            <b>

                ${item.label}

            </b>

        </div>

        `;

    });

}



async function loadForecast() {

    const forecast =
        await fetch(
            `${API_BASE}/analytics/forecast`
        ).then(r => r.json());

    const container =
        document.getElementById(
            "forecast-results"
        );

    if (!container) return;

    container.innerHTML = "";

    renderForecastChart(forecast);

    forecast.forEach(item => {

        container.innerHTML += `

        <div class="chart-item">

            <span>

                ${item.product}

                <br>

                <small>

                    Current:
                    ${item.current_demand}

                </small>

            </span>

            <b>

                ${item.predicted_next_month}

                ${item.trend}

            </b>

        </div>

        `;

    });

}

async function loadRecommendations() {

    const recommendations =
        await fetch(
            `${API_BASE}/analytics/recommendations`
        ).then(r => r.json());


    const container =
        document.getElementById(
            "ai-recommendations"
        );


    if (!container) return;


    container.innerHTML = "";


    recommendations.forEach(item => {

        let icon = "📦";

        if (
            item.recommendation.includes("Increase")
        ) {

            icon = "🔥";

        }

        else if (
            item.recommendation.includes("Maintain")
        ) {

            icon = "⚖️";

        }

        else {

            icon = "📉";

        }


        container.innerHTML += `

        <div class="recommendation-item">

            <span>

                <b>${item.product}</b>

                <br>

                <small>

                    Predicted demand:
                    ${item.prediction}

                </small>

            </span>


            <span class="recommendation-action">

                ${icon}
                ${item.recommendation}

            </span>

        </div>

        `;

    });

}
function downloadPDF() {

    window.open(
        `${API_BASE}/analytics/export/pdf`,
        "_blank"
    );

}


function downloadCSV() {

    window.open(
        `${API_BASE}/analytics/export/csv`,
        "_blank"
    );

}

async function loadRecommendations() {

    const data =
        await fetch(
            `${API_BASE}/analytics/recommendations`
        ).then(r => r.json());

    const container =
        document.getElementById(
            "ai-recommendations"
        );

    if (!container) return;

    container.innerHTML = "";

    data.slice(0, 10).forEach(item => {

        container.innerHTML += `

        <div class="chart-item">

            <span>
                ${item.product}
            </span>

            <b>
                ${item.recommendation}
            </b>

        </div>

        `;

    });
}

window.onload = async () => {

    await loadAnalytics();

    await loadSegments();

    await loadLeadScores();

    await loadForecast();

    await loadRecommendations();

};