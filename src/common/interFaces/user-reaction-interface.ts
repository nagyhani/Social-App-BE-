import { Types } from "mongoose";
import { ON_MODEL, SYS_REACTION } from "../enums";

export interface IUserReaction{

    userId : Types.ObjectId,
    refId : Types.ObjectId // commentId , postId
    reaction : SYS_REACTION,
    onModel :ON_MODEL
}