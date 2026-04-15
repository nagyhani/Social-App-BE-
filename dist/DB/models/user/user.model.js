"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const schema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: function () {
            if (this.provider === common_1.SYS_PROVIDER.google)
                return false;
            return true;
        } },
    phone: { type: String },
    email: { type: String, required: true },
    profilePic: String,
    gender: { type: Number, enum: common_1.SYS_GENDER },
    role: { type: Number, enum: common_1.SYS_ROLE, default: common_1.SYS_ROLE.user },
    provider: { type: Number, enum: common_1.SYS_PROVIDER, default: common_1.SYS_PROVIDER.system },
    credentialsUpdatedAt: { type: Date, default: Date.now() }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", schema);
