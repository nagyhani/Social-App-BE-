"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.resetPasswordSchema = exports.sendOtpSchema = exports.verifySchema = exports.loginSchema = exports.signUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.signUpSchema = zod_1.default.object({
    userName: common_1.generalFields.userName,
    email: common_1.generalFields.email,
    password: common_1.generalFields.password,
    rePassword: common_1.generalFields.rePassword,
    phone: common_1.generalFields.phone
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});
exports.loginSchema = zod_1.default.object({
    email: common_1.generalFields.email,
    password: common_1.generalFields.password
});
exports.verifySchema = zod_1.default.object({
    email: common_1.generalFields.email,
    otp: common_1.generalFields.otp
});
exports.sendOtpSchema = zod_1.default.object({
    email: common_1.generalFields.email
});
exports.resetPasswordSchema = zod_1.default.object({
    email: common_1.generalFields.email,
    otp: common_1.generalFields.otp,
    password: common_1.generalFields.password
});
exports.changePasswordSchema = zod_1.default.object({
    email: common_1.generalFields.email,
    oldPassword: common_1.generalFields.password,
    newPassword: common_1.generalFields.password
});
