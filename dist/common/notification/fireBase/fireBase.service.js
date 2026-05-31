"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireBaseNotificationProvider = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class FireBaseNotificationProvider {
    client;
    constructor(config) {
        this.client = firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(config)
        });
    }
    async send(token, data) {
        await this.client.messaging().send({ token, data });
    }
    async sendAll(tokens, data) {
        await Promise.all(tokens.map((token) => this.send(token, data)));
    }
}
exports.FireBaseNotificationProvider = FireBaseNotificationProvider;
