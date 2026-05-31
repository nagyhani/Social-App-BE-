import z from "zod";
import { BadRequestException, generalFields} from "../../common";


export const createPostSchema = z.object({
    content : generalFields.content,

  })


  export const addReactionSchema = z.object({
    id: generalFields.id ,
    reaction :generalFields.reaction
  })