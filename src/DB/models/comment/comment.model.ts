import { model, Schema, Types } from "mongoose";
import { IComment } from "../../../common";

const schema = new Schema<IComment>({
    userId:{type:Types.ObjectId , ref:"User" , required:true},
    postId:{type:Types.ObjectId , ref:"Post" , required:true},
    parentId:{type:Types.ObjectId , ref:"Comment"},
    mentions: [{type:Types.ObjectId, ref:"User"}],
    content: String,
    attachment:String,
    reactionCount : Number

},{timestamps:true})


export const Comment = model("Comment", schema)