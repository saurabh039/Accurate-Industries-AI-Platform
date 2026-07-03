
async function loadAIInsights(){

    const data =
        await fetch(`${API_BASE}/ai-insights`)
        .then(r=>r.json());


    loadLeads(data.lead_scores);

    loadForecast(data.forecast);

    loadRecommendations(data.recommendations);

    loadSentiment(data.lead_scores);

}



function loadLeads(leads){

    const container =
        document.getElementById("lead-list");

    container.innerHTML = "";


    leads
    .sort((a,b)=>b.score-a.score)
    .slice(0,5)
    .forEach(lead=>{

        let cls = "score-low";

        if(lead.score>=80)
            cls="score-high";

        else if(lead.score>=50)
            cls="score-medium";


        container.innerHTML += `

        <div class="ai-item ${cls}">

            <b>${lead.customer}</b>

            <br>

            Lead Score:
            ${lead.score}/100

        </div>

        `;

    });

}



function loadForecast(forecast){

    const container =
        document.getElementById("forecast-list");

    container.innerHTML = "";


    forecast.forEach(item=>{

        container.innerHTML += `

        <div class="ai-item">

            ${item[0]}

            <b style="float:right">

                ${item[1]}

            </b>

        </div>

        `;

    });

}



function loadRecommendations(recs){

    const container =
        document.getElementById("recommendations");

    container.innerHTML = "";


    recs.forEach(r=>{

        container.innerHTML += `

        <div class="ai-item">

            ${r}

        </div>

        `;

    });

}



function loadSentiment(leads){

    const container =
        document.getElementById("sentiment-list");

    container.innerHTML = "";


    leads.slice(0,6).forEach(l=>{

        container.innerHTML += `

        <div class="ai-item">

            <b>${l.customer}</b>

            <br>

            ${l.sentiment}

        </div>

        `;

    });

}



window.onload = ()=>{

    loadAIInsights();

};