import { UploadResult } from "../../common/cloud/cloud.interface";

export interface CreatePostDTO  {
    content?:string,
    attachments?: UploadResult[]
}

export interface UpdatePostDTO  {
    content?:string,
    attachments?: UploadResult[],
    postId : string
}


