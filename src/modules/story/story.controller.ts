import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import { createStorySchema } from "./story.validation";
import { storyService } from "./story.service";
import { addReaction, BadRequestException, successResponse } from "../../common";
import { addReactionSchema } from "../post/post.validation";
import { storyRepo } from "../../DB/models/story/story.repository";
import { multerUploadFile } from "../../common/utils/multer.utils";


const router = Router()

router.post("/",isAuthenticated,multerUploadFile().single("attachment"),isValid(createStorySchema),async (req:Request,res:Response,next:NextFunction)=>{

     const hasFile = !!req.file || (req.files && req.files.length as number > 0)
const hasContent = !!req.body.content

if (!hasFile && !hasContent) {
  throw new BadRequestException("content or attachment is required")
}
   const createdStory = await storyService.create(req.body,req.user._id, req.file as Express.Multer.File )

   return successResponse({res,status:201,message:"done",data:{createdStory}})
})

router.post("/add-reaction",isAuthenticated,isValid(addReactionSchema),async (req:Request,res:Response,next:NextFunction)=>{
    await addReaction(req.body,req.user._id,storyRepo)

    return successResponse({res,status:201,message:"done"})
})

router.get("/:id",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{

   const story = await storyService.get(req.params.id as string,req.user._id)

  return successResponse({res,message:"done",data:{story}})
})

router.patch("/:id",isAuthenticated,multerUploadFile().single("attachment"),isValid(createStorySchema),async (req:Request,res:Response,next:NextFunction)=>{

    const hasFile = !!req.file || (req.files && req.files.length as number > 0)
const hasContent = !!req.body.content

if (!hasFile && !hasContent) {
  throw new BadRequestException("content or attachment is required")
}

    const updatedStory = await storyService.update(req.params.id as string,req.user._id,req.body,req.file as Express.Multer.File)

    return successResponse({res,message:"done",data:{updatedStory}})
})

router.delete("/:id",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{

    await storyService.delete(req.params.id as string ,req.user._id)

    return successResponse({res,message:"done"})
})




export default router