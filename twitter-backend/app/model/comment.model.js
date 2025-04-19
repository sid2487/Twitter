import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);