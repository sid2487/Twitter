import express from "express";
import { createTweet, getTweets } from "../controllers/tweet.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { Upload } from "../middleware/mutler.middleware.js";

const router = express.Router();

router.post("/", protect, Upload.single("media"), createTweet);
router.get("/", getTweets);

export default router;