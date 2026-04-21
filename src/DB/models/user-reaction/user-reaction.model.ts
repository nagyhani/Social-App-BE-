import { model, Schema, Types } from "mongoose";
import { IUserReaction, ON_MODEL, SYS_REACTION } from "../../../common";

const schema = new Schema<IUserReaction>({
    userId: {type : Types.ObjectId ,ref:"User" , required :true},
    refId : {type : Types.ObjectId , refPath:"onModel", required :true},
    onModel : {type : String , enum : ON_MODEL , required:true},
    reaction : {type : Number , enum :  SYS_REACTION , default : SYS_REACTION.like}

},{timestamps : true})

export const UserReaction = model("UserReaction" , schema)