"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
exports.compare = compare;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function hash(password) {
    return bcrypt_1.default.hash(password, 10);
}
async function compare(password, hashedPassword) {
    return bcrypt_1.default.compare(password, hashedPassword);
}
