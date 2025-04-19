const base = "http://localhost:5000/api/auth";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if(registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            console.log({ username, password });

            const res = await fetch(`${base}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });


            const data = await res.json();

            console.log("Status:", res.status);
            console.log("Response data:", data);
            
            if(data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration Failed" );
            }
        });
    }

    if(loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const res = await fetch(`${base}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if(data.token){
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", username); // store the username
                window.location.href = "index.html";
            }
        });
    }

    // welcome message and logout 
    const welcomeText = document.getElementById("welcome-text");
    const logoutBtn = document.getElementById("logoutBtn");

    if(welcomeText) {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        if(!token || !username) {
            window.location.href = "login.html";
        } else {
            welcomeText.innerText = `Welcome, ${username}`;
        }
    }

    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "login.html";
        })
    }


});