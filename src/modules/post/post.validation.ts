import z from "zod";
import { BadRequestException, generalFields} from "../../common";


export const createPostSchema = z.object({
    content : generalFields.content,
    attachments : generalFields.attachments
  }).refine((data)=>{
    const {attachments,content} = data

    if(!content && !attachments || attachments?.length == 0)  throw new BadRequestException("content or attachments is required")

    return true
  })


  export const addReactionSchema = z.object({
    postId: generalFields.postId ,
    reaction :generalFields.reaction
  })