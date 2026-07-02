const CHAT_API =
    "http://127.0.0.1:8000/api/chat/";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const toggleBtn =
            document.getElementById(
                "chat-toggle"
            );

        const closeBtn =
            document.getElementById(
                "close-chat"
            );

        const clearBtn =
            document.getElementById(
                "clear-chat"
            );

        const minimizeBtn =
            document.getElementById(
                "minimize-chat"
            );

        const chatWindow =
            document.getElementById(
                "chat-window"
            );

        const sendBtn =
            document.getElementById(
                "send-btn"
            );

        const input =
            document.getElementById(
                "chat-input"
            );

        const messages =
            document.getElementById(
                "chat-messages"
            );

        const heroRight =
            document.getElementById(
                "hero-right"
            );

        let chatHistory = [];


        /* ===========================
        SESSION ID
        =========================== */

        let sessionId =
            localStorage.getItem(
                "accurate-session-id"
            );

        if(!sessionId){

            sessionId =
                crypto.randomUUID();

            localStorage.setItem(
                "accurate-session-id",
                sessionId
            );
        }

        /* ===========================
           DEFAULT WELCOME
        =========================== */

        const defaultWelcome = `

            <div class="message bot-message welcome-message">

                <h3>
                    👋 Welcome to Accurate AI
                </h3>

                <p>
                    Your Industrial Manufacturing Assistant
                </p>

                <hr>

                <ul>

                    <li>🛠 Product Information</li>

                    <li>⚙ CNC & VMC Services</li>

                    <li>🏭 Machinery Details</li>

                    <li>📋 Quotations</li>

                    <li>📞 Contact Information</li>

                </ul>

                <div class="welcome-footer">

                    Available 24/7 • Instant Responses

                </div>

            </div>

        `;


        /* ===========================
           SAVE CHAT
        =========================== */

        function saveChat() {

            localStorage.setItem(
                "accurate-chat-history",
                messages.innerHTML
            );
        }


        /* ===========================
           LOAD CHAT
        =========================== */

        function loadChat() {

            const savedChat =
                localStorage.getItem(
                    "accurate-chat-history"
                );

            if(savedChat){

                messages.innerHTML =
                    savedChat;

            }

            else{

                messages.innerHTML =
                    defaultWelcome;
            }
        }


        /* ===========================
           AUTO SCROLL
        =========================== */

        function scrollBottom(){

            messages.scrollTo({

                top:
                messages.scrollHeight,

                behavior:"smooth"
            });
        }


        /* ===========================
           TIMESTAMP
        =========================== */

        function getTime(){

            return new Date()
                .toLocaleTimeString(
                    [],
                    {
                        hour:"2-digit",
                        minute:"2-digit"
                    }
                );
        }


        loadChat();


        /* ===========================
           OPEN CHAT
        =========================== */

        toggleBtn.onclick = () => {

            chatWindow.classList.add("active");

            toggleBtn.style.opacity = "0";
            toggleBtn.style.pointerEvents = "none";

            requestAnimationFrame(() => {

                chatWindow.classList.add("open");

            });

            if(window.innerWidth > 768){

                heroRight?.classList.add("chat-open");
            }

            scrollBottom();
        };

        /* ===========================
           CLOSE CHAT
        =========================== */

        closeBtn.onclick = () => {

            chatWindow.classList.remove("open");

            heroRight?.classList.remove("chat-open");

            toggleBtn.style.opacity = "1";
            toggleBtn.style.pointerEvents = "auto";

            setTimeout(() => {

                chatWindow.classList.remove("active");

            },300);
        };


        /* ===========================
           MINIMIZE
        =========================== */

        if(minimizeBtn){

            minimizeBtn.onclick = () => {

                chatWindow.classList.toggle(
                    "minimized"
                );

            };

        }


        /* ===========================
   CLEAR CHAT MODAL
=========================== */

const clearModal =
    document.getElementById(
        "clear-modal"
    );

const cancelClear =
    document.getElementById(
        "cancel-clear"
    );

const confirmClear =
    document.getElementById(
        "confirm-clear"
    );


if(clearBtn){

    clearBtn.onclick = () => {

        clearModal.classList.add(
            "active"
        );

    };

}


cancelClear.onclick = () => {

    clearModal.classList.remove(
        "active"
    );

};


confirmClear.onclick = () => {

    localStorage.removeItem(
        "accurate-chat-history"
    );

    chatHistory = [];

    messages.innerHTML =
        defaultWelcome;

    saveChat();

    clearModal.classList.remove(
        "active"
    );

};


        /* ===========================
           SEND MESSAGE
        =========================== */

        async function sendMessage(
            customText = null
        ){

            const text =
                customText ||
                input.value.trim();

            if(!text) return;


            chatHistory.push({

                role:"user",
                content:text

            });


            messages.innerHTML += `

                <div class="message user-message">

                    ${text}

                    <div class="message-time">

                        ${getTime()}

                    </div>

                </div>

            `;


            input.value = "";

            saveChat();

            scrollBottom();


            messages.innerHTML += `

                <div
                    id="typing-message"
                    class="message bot-message typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            `;


            scrollBottom();


            sendBtn.innerHTML = "⏳";

            sendBtn.disabled = true;


            try{

                const response =
                    await fetch(
                        CHAT_API,
                        {

                            method:"POST",

                            headers:{
                                "Content-Type":
                                "application/json"
                            },

                            body: JSON.stringify({

                            message: text,

                            session_id: sessionId,

                            history: chatHistory
                        })

                        }
                    );


                const data =
                    await response.json();


                sendBtn.innerHTML = "➜";

                sendBtn.disabled = false;


                document
                    .getElementById(
                        "typing-message"
                    )
                    ?.remove();


                chatHistory.push({

                    role:"assistant",
                    content:data.response

                });


                messages.innerHTML += `

                    <div class="message bot-message">

                        ${marked.parse(
                            data.response
                        )}

                        <div class="message-time">

                            ${getTime()}

                        </div>

                    </div>

                `;


                saveChat();

            }

            catch(error){

                console.error(error);

                sendBtn.innerHTML = "➜";

                sendBtn.disabled = false;


                document
                    .getElementById(
                        "typing-message"
                    )
                    ?.remove();


                messages.innerHTML += `

                    <div class="message bot-message">

                        ❌ Unable to connect
                        to the AI server.

                        <div class="message-time">

                            ${getTime()}

                        </div>

                    </div>

                `;


                saveChat();
            }


            scrollBottom();
        }


        /* ===========================
           SEND BUTTON
        =========================== */

        sendBtn.onclick = () =>
            sendMessage();


        input.addEventListener(
            "keypress",
            e => {

                if(e.key === "Enter"){

                    sendMessage();

                }

            }
        );


        /* ===========================
           QUICK ACTIONS
        =========================== */

        document
            .querySelectorAll(
                ".chat-shortcuts button"
            )
            .forEach(btn => {

                btn.onclick = () => {

                    sendMessage(
                        btn.dataset.text
                    );

                };

            });

    }
);
