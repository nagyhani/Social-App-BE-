import { Types } from "mongoose";

export interface IUserFriend {
    user:Types.ObjectId,
    friend:Types.ObjectId
}