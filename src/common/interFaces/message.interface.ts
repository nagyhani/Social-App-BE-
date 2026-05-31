import { Types } from "mongoose";

export interface IMessage {
    content: string,
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
    chat:Types.ObjectId,
    readBy?: {user:Types.ObjectId,readAt:Date}[],
    deleteFor?: {user:Types.ObjectId,deletedAt:Date}[]

}