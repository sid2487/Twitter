export const API = "http://localhost:5000/api";

export const checkAuth = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if(!token && !user) {
        window.location.href = "login.html";
    }
    return token;
};