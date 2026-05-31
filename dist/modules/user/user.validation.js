"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateUserSchema = zod_1.default.object({
    userName: zod_1.default.string().min(2, { message: "min char is 2 " }).max(20, { message: "max char is 20 " }).regex(/^(?!\d+$)[a-zA-Z][a-zA-Z0-9]*$/).optional(),
    email: zod_1.default.email({ message: "invalid email pattern EX : johndoe123@gmail.com" }).optional(),
    password: zod_1.default.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: "password must be At least 8 characters long ,Contains at least one uppercase letter,Contains at least one lowercase letter,Contains at least one digit,Contains at least one special character (e.g., @$!%*?&)" }).optional(),
    phone: zod_1.default.string().regex(/^(?:\+20|0)?1[0125][0-9]{8}$/, { message: "number invalid" }).optional(),
});
