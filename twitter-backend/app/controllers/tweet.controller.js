import { Tweet } from "../model/tweet.model.js";
import cloudinary from "../config/cloudinary.js";

export const createTweet = async (req, res, next) => {
    try {
        let mediaUrl = "";

        console.log(req.file);

        // if there is a file upload it to cloudinary
        if (req.file) {
            const streamUpload = (fileBuffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "auto" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );

                    stream.end(fileBuffer);
                });
            };

            const result = await streamUpload(req.file.buffer);
            mediaUrl = result.secure_url; 
        }

        if (!req.body.content && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Tweet must have at least content or media.",
            });
        }
        
        const tweet = await Tweet.create({
            content: req.body.content || "",
            media: mediaUrl,
            user: req.user._id,
        });

        res.status(201).json({ success: true, tweet });
    } catch (err) {
        next(err);
    }
};


export const getTweets = async (req, res, next) => {
    try {
        const tweets = await Tweet.find().populate("user", "username").sort({ createdAt: -1 });
        res.status(200).json({ success: true, tweets });
    } catch (err) {
        next(err);
    }
}