"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFriend = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    friend: { type: mongoose_1.Types.ObjectId, required: true, ref: "User" },
    user: { type: mongoose_1.Types.ObjectId, required: true, ref: "User" }
}, { timestamps: true });
exports.UserFriend = (0, mongoose_1.model)("UserFriend", schema);
