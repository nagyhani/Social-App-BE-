import { Types } from "mongoose"
import { SYS_REACTION } from "../../common"

export interface CreatePostDTO  {
    content?:string,
    attachments?: string[]
}

