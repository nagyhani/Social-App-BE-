"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    content: { type: String, required: true },
    sender: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    chat: { type: mongoose_1.Types.ObjectId, ref: "Chat", required: true },
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)("Message", schema);
