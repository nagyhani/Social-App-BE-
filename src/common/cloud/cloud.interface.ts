import { Types } from "mongoose"

export type UploadResult = {
  key?: string       
  secure_url: string    
  public_id : string 
}

export interface ICloudProvider {

    uploadFile(file:Express.Multer.File,userId:Types.ObjectId) :Promise<UploadResult>

    deleteFile(key:string) : Promise<void>

    getFile(key:string): Promise<NodeJS.ReadableStream | null>

}