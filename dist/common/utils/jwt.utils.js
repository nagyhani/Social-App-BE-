"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokes = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const signToken = (payload, secretKey, options = {}) => {
    payload.jti = node_crypto_1.default.randomBytes(10).toString("hex");
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
const verifyToken = (token, secretKey, options = {}) => {
    return jsonwebtoken_1.default.verify(token, secretKey, options);
};
exports.verifyToken = verifyToken;
const generateTokes = (payload) => {
    const accessToken = signToken(payload, "kljfpiofieqihrriohepoighoiwvhtuwihuvsvsvsdvsgdrghfsfdshyyhetn", { expiresIn: "1h" });
    const refreshToken = signToken(payload, "klashweiufyiewoyf6465f4wefjuwegfiugwfguiowegf", { expiresIn: "1y" });
    return { accessToken, refreshToken };
};
exports.generateTokes = generateTokes;
