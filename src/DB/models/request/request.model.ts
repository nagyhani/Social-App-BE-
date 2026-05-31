import { model, Schema, Types } from "mongoose";
import { IRequest } from "../../../common";


const schema = new Schema<IRequest>({
    receiver : {type:Types.ObjectId ,ref:"User", required:true},
    sender : {type:Types.ObjectId ,ref:"User", required:true}
},{timestamps : true})

export const Request = model("Request" , schema)