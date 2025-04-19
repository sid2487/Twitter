import { API, checkAuth } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    const tweetForm = document.getElementById("tweetForm");
    const tweetsContainer = document.getElementById("tweets");

    // load tweets when dom is ready
    loadTweets();


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

    async function toggleLike(tweetId) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/tweet/${tweetId}/like`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        if(res.ok) loadTweets();
    };


    async function postComment(tweetId, text) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/tweet/${tweetId}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ text }),
        });
        if(res.ok) loadTweets();
    };

    async function loadTweets() {
        tweetsContainer.innerHTML = ""; 

        try {
            const res = await fetch(`${API}/tweet`);
            const data = await res.json();
            console.log("Api response:", data);

            data.tweets.reverse().forEach(tweet => {
                const div = document.createElement("div");
                div.className = "tweet-card";
                // tweet content
                div.innerHTML = `
                    <p><strong>@${tweet.user.username}</strong>: ${tweet.content}</p>
                    ${tweet.media ? `<img src="${tweet.media}" />` : ""}
                `;

                // like buttton
                const likeBtn = document.createElement("button");
                likeBtn.className = "like-button";
                likeBtn.innerText = `❤️ Like (${tweet.likes.length})`;
                likeBtn.addEventListener("click", () => toggleLike(tweet._id));

                // comment display
                const commentSection = document.createElement("div");
                commentSection.className = "comment-section";

                if(tweet.comments && tweet.comments.length > 0) {
                    tweet.comments.forEach(comment => {
                        const commentDiv = document.createElement("div");
                        commentDiv.className = "comment";
                        commentDiv.innerHTML = `<strong>@${comment.user.username}</strong>: ${comment.text}`;
                        commentSection.appendChild(commentDiv);
                    });
                } else {
                    const noComment = document.createElement("p");
                    noComment.className = "no-comment";
                    noComment.innerText = "No comments yet.";
                    commentSection.appendChild(noComment);
                }

                // comment Form
                const commentForm = document.createElement("form");
                commentForm.className = "comment-form";
                commentForm.innerHTML = `
                <input type="text" placeholder="write a comment...." class="comment-input" required />
                <button type="submit">Comment</button>
                `;

                commentForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const input = commentForm.querySelector(".comment-input");
                    const commentText = input.value.trim();
                    if(commentText) {
                        postComment(tweet._id, commentText);
                        input.value = "";
                    }
                });

                div.appendChild(likeBtn);
                div.appendChild(commentSection);
                div.appendChild(commentForm);


                tweetsContainer.appendChild(div);
            });
        } catch (error) {
            console.error("Failed to load tweets", error);
        }
    }
});