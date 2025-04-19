import { API, checkAuth } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    const tweetForm = document.getElementById("tweetForm");
    const tweetsContainer = document.getElementById("tweets");

    fetch(`${API}/tweet`)
    .then(res => res.json())
    .then(data => {
        console.log("API Response:", data); // see the structure of api
        data.tweets.reverse().forEach(tweet => {
            const div = document.createElement("div");
            div.className = "tweet-card";
            div.innerHTML = `
            <p><strong>@${tweet.user.username}</strong>: ${tweet.content}</p>
            ${tweet.media ? `<img src="${tweet.media}" />` : ""}
            `;
            tweetsContainer.appendChild(div);
        });
    });


    tweetForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const content = document.getElementById("content").value;
        const media = document.getElementById("media").files[0];

        const formData = new FormData();
        formData.append("content", content);
        if(media) formData.append("media", media);

        // show loading indicator
        const loadingIndicator = document.createElement("div");
        loadingIndicator.className = "loading";
        loadingIndicator.innerText = "Posting....";
        tweetForm.appendChild(loadingIndicator);

        // hide the submit button while posting
        const submitButton = tweetForm.querySelector("button[type='submit']");
        submitButton.disabled = true;

        
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/tweet`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        // hide loadig indiacator
        loadingIndicator.remove();
        submitButton.disabled =  false;


        if(data.success) {
            // success message
            const successMessage = document.createElement("div");
            successMessage.className = "success-message";
            successMessage.innerText = "Post successfully uploaded!";
            tweetForm.appendChild(successMessage);

            setTimeout(() => {
                successMessage.remove();
            }, 2000);

            location.reload(); // reload to display the new post
        } else {
            // show error message
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.innerText = "Something went wrong. Please try again.";
            tweetForm.appendChild(errorMessage);

            // remove the message 
            setTimeout(() => {
                errorMessage.remove();
            }, 2000);
        }
    });
});