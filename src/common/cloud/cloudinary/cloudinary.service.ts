import { Types } from "mongoose";
import { ICloudProvider, UploadResult } from "../cloud.interface";
import { v2 as cloudinary } from 'cloudinary'
import { API_KEY, API_SECRET, APP_NAME, CLOUD_NAME } from "../../../config";

cloudinary.config({ 
  cloud_name: CLOUD_NAME, 
  api_key: API_KEY, 
  api_secret: API_SECRET 
});




export class CloudinaryProvider implements ICloudProvider{

  async uploadFile(file: Express.Multer.File, userId: Types.ObjectId): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `${APP_NAME}/users/${userId}` },
      (error, result) => {
        if (error) return reject(error)
          
        resolve({public_id:(result?.public_id) as string,secure_url:(result?.secure_url) as string})
      }
    )

    stream.end(file.buffer)
  })


}
    deleteFile(public_id: string): Promise<void> {
        return  cloudinary.uploader.destroy(public_id)
    }
    getFile(key: string): Promise<NodeJS.ReadableStream | null> {
        throw new Error("Method not implemented.");
    }

}