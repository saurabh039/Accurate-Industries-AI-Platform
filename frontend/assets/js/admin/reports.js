const API = "http://127.0.0.1:8000";


async function askBot() {

    const question = document
        .getElementById("question")
        .value;

    if (!question) return;


    const response = await fetch(

        `${API}/chatbot`,

        {
            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                question
            })
        }
    );

    const data = await response.json();

    const chatBox =
        document.getElementById("chat-box");


    chatBox.innerHTML += `

        <p>

            <b>You:</b>
            ${question}

        </p>

        <p>

            <b>AI:</b>
            ${data.answer}

        </p>

        <hr>

    `;

    chatBox.scrollTop =
        chatBox.scrollHeight;

    document.getElementById(
        "question"
    ).value = "";
}