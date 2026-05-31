import { S3Client } from "@aws-sdk/client-s3";
import { ICloudProvider, UploadResult } from "../cloud.interface";
import { Types } from "mongoose";

interface s3Config {
    region:string,
    credentials:{
        accessKeyId:string,
        secretAccessKey:string
    } 
}

export class s3CloudProvider implements ICloudProvider {

    private client: S3Client

    constructor(config:s3Config){
        this.client = new S3Client({
            region:config.region,
            credentials:config.credentials
        })
    }


    uploadFile(file: Express.Multer.File, userId:Types.ObjectId): Promise<UploadResult> {
        throw new Error("Method not implemented.");
    }
    deleteFile(key: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getFile(key: string): Promise<NodeJS.ReadableStream | null> {
        throw new Error("Method not implemented.");
    }

}