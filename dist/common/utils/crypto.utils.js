"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const node_crypto_1 = __importStar(require("node:crypto"));
function encrypt(plaintext) {
    const iv = node_crypto_1.default.randomBytes(16);
    const cipher = (0, node_crypto_1.createCipheriv)("aes-256-cbc", Buffer.from("23186468454648784165136846876115"), iv);
    let encryptedData = cipher.update(plaintext, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return `${iv.toString("hex")}:$${encryptedData}`;
}
function decrypt(encryptedData) {
    const [iv, encryptedValue] = encryptedData.split(":");
    const ivBinaryLike = Buffer.from(iv, "hex");
    const decipher = node_crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from("23186468454648784165136846876115"), ivBinaryLike);
    let decryptedData = decipher.update(encryptedValue, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
}
