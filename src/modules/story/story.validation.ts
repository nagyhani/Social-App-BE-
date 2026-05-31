import z from "zod"
import { BadRequestException, generalFields } from "../../common"


export const createStorySchema = z.object({
  content: generalFields.content.optional(),
})