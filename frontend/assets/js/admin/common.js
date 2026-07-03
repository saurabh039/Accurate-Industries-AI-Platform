const API_BASE = "http://127.0.0.1:8000";

function getToken() {
    return localStorage.getItem("token");
}

if (!getToken()) {
    alert("Please login first");
    window.location.href = "../admin-login.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "../admin-login.html";
}

document.addEventListener("DOMContentLoaded", () => {

    const currentPage =
        window.location.pathname.split("/").pop();

    document
        .querySelectorAll(".menu a")
        .forEach(link => {

            if (
                link.getAttribute("href")
                === currentPage
            ) {

                link.parentElement
                    .classList
                    .add("active");

            }

        });

});