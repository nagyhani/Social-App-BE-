import z from "zod"
import { generalFields } from "../../common"

export const createCommentSchema = z.object({
    content : generalFields.content

  })