"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../enums");
exports.generalFields = {
    userName: zod_1.default.string({ message: "Name is required" }).min(2, { message: "min char is 2 " }).max(20, { message: "max char is 20 " }).regex(/^(?!\d+$)[a-zA-Z][a-zA-Z0-9]*$/),
    email: zod_1.default.email({ message: "invalid email pattern EX : johndoe123@gmail.com" }),
    password: zod_1.default.string({ message: "password is required" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "password must be At least 8 characters long ,Contains at least one uppercase letter,Contains at least one lowercase letter,Contains at least one digit,Contains at least one special character (e.g., @$!%*?&)" }),
    rePassword: zod_1.default.string({ message: "rePassword is required" }),
    gender: zod_1.default.enum(enums_1.SYS_GENDER).optional(),
    phone: zod_1.default.string({ message: "Phone is required" }).regex(/^(?:\+20|0)?1[0125][0-9]{8}$/, { message: "number invalid" }),
    otp: zod_1.default.string({ message: "OTP is required" }).regex(/^\d{6}$/, { message: "otp should be six numbers" }),
    content: zod_1.default.string().optional(),
    attachments: zod_1.default.array(zod_1.default.string()).optional(),
    reaction: zod_1.default.enum(enums_1.SYS_REACTION),
    id: zod_1.default.string()
};
