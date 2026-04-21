import { Types } from "mongoose"
import { SYS_REACTION } from "../../common"

export interface CreatePostDTO  {
    content?:string,
    attachments?: string[]
}

export interface AddReactionDTO {
    postId : Types.ObjectId,
    reaction : SYS_REACTION
}