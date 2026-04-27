"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    content: String,
    attachments: [String],
    reactionCount: Number,
    commentCount: Number
}, { timestamps: true });
exports.Post = (0, mongoose_1.model)("Post", schema);
