import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    content: String,
    media: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }],
}, {timestamps: true}
);

export const Tweet = mongoose.model("Tweet", tweetSchema);