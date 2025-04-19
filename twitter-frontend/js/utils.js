export const API = "http://localhost:5000/api";

export const checkAuth = () => {
    const token = localStorage.getItem("token");
    if(!token) {
        window.location.href = "login.html";
    }
    return token;
};