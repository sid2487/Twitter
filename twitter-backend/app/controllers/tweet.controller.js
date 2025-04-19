import { Tweet } from "../model/tweet.model.js";
import cloudinary from "../config/cloudinary.js";
import { Comment } from "../model/comment.model.js";

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
        const tweets = await Tweet.find().populate("user", "username").populate("likes", "username").sort({ createdAt: -1 });

        // fetch comments for each tweet
        const tweetsWithComments = await Promise.all(tweets.map(async(tweet) => {
            const comments = await Comment.find({ tweet: tweet._id }).populate("user", "username").sort({ createdAt: 1 }); 

            return {
                ...tweet.toObject(),
                comments,
            };
        }));
        res.status(200).json({ success: true, tweets: tweetsWithComments });
    } catch (err) {
        next(err);
    }
}

// like tweet
export const likeTweet = async (req, res) => {
    const tweetId = req.params.id;
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);
    if(!tweetId) return res.status(404).json({ message: "Tweet not found" });

    const liked = tweet.likes.includes(userId);
    if(liked) {
        tweet.likes.pull(userId);
    } else {
        tweet.likes.push(userId);
    }

    await tweet.save();
    res.status(200).json({ likes: tweet.likes });
};

// get likes
export const getLikes = async (req, res) => {
    const tweet = await Tweet.findById(req.params.id).populate("likes", "username");
    if(!tweet) return res.status(404).json({ message: "Tweet not found" });
    res.status(200).json({ likes: tweet.likes });
};


// comment tweet
export const commentTweet = async (req, res) => {
    const { text } = req.body;
    const userId = req.user._id;
    const tweetId = req.params.id;

    const comment = await Comment.create({ tweet: tweetId, user: userId, text });
    res.status(201).json({ message: "Comment added", comment }); // here comment includes tweet, user, and text.
};

// get comments
export const getComments = async (req, res) => {
    const tweetId = req.params.id;
    const comments = await Comment.find({ tweet: tweetId })
    .populate("user", "username")
    .sort({ createdAt: -1 });
    res.status(200).json({ comments });
}