import { model, Schema, Types } from "mongoose";
import { IMessage } from "../../../common";


const schema = new Schema<IMessage>({
    content:{type:String,required:true},
    sender:{type:Types.ObjectId,ref:"User",required:true},
    chat:{type:Types.ObjectId,ref:"Chat",required:true},
    

},{timestamps:true})

export const Message = model("Message",schema)