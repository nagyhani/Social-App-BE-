import {  Types } from "mongoose";

export interface IPost {
    userId: Types.ObjectId,
    content?:string,
    attachments?:{secure_url?:String,public_id:String}[],
    reactionCount : number,
    commentCount : number
}