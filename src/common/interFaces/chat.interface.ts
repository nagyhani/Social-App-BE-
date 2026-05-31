import { Types } from "mongoose";
import { CHAT_TYPE } from "../enums";

export interface IChat {

    participants: Types.ObjectId[],
    chatType: CHAT_TYPE,
    groupId: Types.ObjectId[],
    groupName: string,
    groupImage: string,
    admin:Types.ObjectId[]
}