import { Types } from "mongoose";

export interface IStory{
        userId: Types.ObjectId,
        content?:string,
        attachment?:{secure_url:String,public_id:String} | null,
        reactionCount : number,
         expiresAt?:Date
}