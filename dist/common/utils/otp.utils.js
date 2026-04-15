"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
function generateOTP() {
    return Math.floor(Math.random() * 100000 + 900000);
}
