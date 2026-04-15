"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config");
const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.EMAIL_USER,
            pass: config_1.PASSWORD_USER
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    await transporter.sendMail({
        from: "'social app' <nagyhani337@gmail.com>",
        to,
        html,
        subject
    });
};
exports.sendEmail = sendEmail;
