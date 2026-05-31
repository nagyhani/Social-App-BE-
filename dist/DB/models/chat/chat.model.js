"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const schema = new mongoose_1.Schema({
    participants: { type: [mongoose_1.Types.ObjectId], ref: "User", required: true },
    chatType: { type: String, enum: common_1.CHAT_TYPE, default: common_1.CHAT_TYPE.private },
    admin: { type: [mongoose_1.Types.ObjectId], ref: "User", required: function () {
            return this.chatType == common_1.CHAT_TYPE.group;
        } }
}, { timestamps: true });
exports.Chat = (0, mongoose_1.model)("Chat", schema);
