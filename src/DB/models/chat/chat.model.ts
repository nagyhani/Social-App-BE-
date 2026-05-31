import { model, Schema, Types } from "mongoose";
import { CHAT_TYPE, IChat } from "../../../common";


const schema = new Schema<IChat>({
    participants: {type: [Types.ObjectId],ref:"User",required:true},
    chatType: {type:String,enum:CHAT_TYPE ,default:CHAT_TYPE.private},
    admin: {type: [Types.ObjectId],ref:"User" ,required: function(){
        return this.chatType == CHAT_TYPE.group
    } }
},{timestamps:true})

export const Chat =  model("Chat" ,schema)