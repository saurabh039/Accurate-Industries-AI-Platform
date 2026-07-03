
async function loadAnalytics(){

    const products =
        await fetch(`${API_BASE}/products`)
        .then(r => r.json());

    const inquiries =
        await fetch(`${API_BASE}/inquiries`)
        .then(r => r.json());


    document.getElementById(
        "analytics-products"
    ).innerText =
        products.length;


    document.getElementById(
        "analytics-inquiries"
    ).innerText =
        inquiries.length;


    const demandMap = {};


    inquiries.forEach(i => {

        (i.products || []).forEach(p => {

            demandMap[p.name] =
                (demandMap[p.name] || 0)
                + p.quantity;

        });

    });


    const sortedProducts =
        Object.entries(demandMap)
        .sort((a,b)=>b[1]-a[1]);


    if(sortedProducts.length){

        document.getElementById(
            "top-product"
        ).innerText =
            sortedProducts[0][0];

    }


    renderDemandChart(sortedProducts);

    renderInquiryStats(inquiries);

}



function renderDemandChart(data){

    const container =
        document.getElementById(
            "product-demand"
        );

    container.innerHTML = "";


    data.slice(0,8).forEach(item => {

        container.innerHTML += `

        <div class="chart-item">

            <span>${item[0]}</span>

            <b>${item[1]} requests</b>

        </div>

        `;

    });

}



function renderInquiryStats(inquiries){

    const container =
        document.getElementById(
            "inquiry-stats"
        );


    const pending =
        inquiries.filter(
            i => i.status !== "Completed"
        ).length;


    const completed =
        inquiries.filter(
            i => i.status === "Completed"
        ).length;


    container.innerHTML = `

        <div class="chart-item">

            <span>
                Pending Inquiries
            </span>

            <b>
                ${pending}
            </b>

        </div>


        <div class="chart-item">

            <span>
                Completed Inquiries
            </span>

            <b>
                ${completed}
            </b>

        </div>


        <div class="chart-item">

            <span>
                Completion Rate
            </span>

            <b>

                ${
                    inquiries.length
                    ?

                    Math.round(
                        completed
                        /
                        inquiries.length
                        *100
                    )

                    : 0
                }%

            </b>

        </div>

    `;

}



window.onload = () => {

    loadAnalytics();

};