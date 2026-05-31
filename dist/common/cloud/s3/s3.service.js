"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3CloudProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class s3CloudProvider {
    client;
    constructor(config) {
        this.client = new client_s3_1.S3Client({
            region: config.region,
            credentials: config.credentials
        });
    }
    uploadFile(file, userId) {
        throw new Error("Method not implemented.");
    }
    deleteFile(key) {
        throw new Error("Method not implemented.");
    }
    getFile(key) {
        throw new Error("Method not implemented.");
    }
}
exports.s3CloudProvider = s3CloudProvider;
