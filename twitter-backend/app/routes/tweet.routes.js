import express from "express";
import { commentTweet, createTweet, getComments, getLikes, getTweets, likeTweet } from "../controllers/tweet.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { Upload } from "../middleware/mutler.middleware.js";

const router = express.Router();

router.post("/", protect, Upload.single("media"), createTweet);
router.get("/", getTweets);

router.post("/:id/like", protect, likeTweet);
router.get("/:id/likes", getLikes);

router.post("/:id/comment", protect, commentTweet);
router.get("/:id/comments", getComments);

export default router;