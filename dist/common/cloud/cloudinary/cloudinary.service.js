"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = require("../../../config");
cloudinary_1.v2.config({
    cloud_name: config_1.CLOUD_NAME,
    api_key: config_1.API_KEY,
    api_secret: config_1.API_SECRET
});
class CloudinaryProvider {
    async uploadFile(file, userId) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: `${config_1.APP_NAME}/users/${userId}` }, (error, result) => {
                if (error)
                    return reject(error);
                resolve({ public_id: (result?.public_id), secure_url: (result?.secure_url) });
            });
            stream.end(file.buffer);
        });
    }
    deleteFile(public_id) {
        return cloudinary_1.v2.uploader.destroy(public_id);
    }
    getFile(key) {
        throw new Error("Method not implemented.");
    }
}
exports.CloudinaryProvider = CloudinaryProvider;
