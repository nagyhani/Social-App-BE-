import { model, Schema, Types } from "mongoose";
import { IUserFriend } from "../../../common";

const schema = new Schema<IUserFriend>({
    friend: {type:Types.ObjectId ,required:true,ref:"User"},
    user: {type:Types.ObjectId ,required:true,ref:"User"}
},{timestamps:true})

export const UserFriend = model("UserFriend",schema)


