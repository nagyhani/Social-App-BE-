"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const comment_repository_1 = require("../comment/comment.repository");
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    content: String,
    attachments: [{ secure_url: String, public_id: String }],
    reactionCount: Number,
    commentCount: Number
}, { timestamps: true });
schema.pre("deleteOne", async function () {
    const filter = this.getFilter();
    const replies = await comment_repository_1.commentRepo.getAll({ postId: filter._id });
    if (replies?.length > 0) {
        for (const reply of replies) {
            await comment_repository_1.commentRepo.delete({ _id: reply._id });
        }
    }
});
exports.Post = (0, mongoose_1.model)("Post", schema);
