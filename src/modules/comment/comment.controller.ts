import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import commentService from "./comment.service";
import { addReaction, BadRequestException, successResponse } from "../../common";
import { addReactionSchema } from "../post/post.validation";
import { commentRepo} from "../../DB/models/comment/comment.repository";
import { Types } from "mongoose";
import { createCommentSchema } from "./comment.validation";
import { multerUploadFile } from "../../common/utils/multer.utils";


const router = Router()


router.post("/add-reaction",isAuthenticated,isValid(addReactionSchema),async (req:Request,res:Response,next:NextFunction)=>{
  console.log(req.user._id);
  
  await addReaction(req.body,req.user._id,commentRepo)

   return successResponse({res,message:"done"})

})

router.get("/:postId{/:parentId}",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{

  const comments = await commentService.getAll(req.params)

  return successResponse({res,message:"done",data:{comments}})

})

router.patch("/:id",isAuthenticated,multerUploadFile().single("attachment"),isValid(createCommentSchema),async (req:Request,res:Response,next:NextFunction)=>{

    const hasFile = !!req.file || (req.files && req.files.length as number > 0)
  const hasContent = !!req.body.content
  
  if (!hasFile && !hasContent) {
    throw new BadRequestException("content or attachment is required")
  }
  const updatedComment = await commentService.update(req.body,req.user._id,req.params.id as string,req.file as Express.Multer.File)

  return successResponse({res,message:"done",data:{updatedComment}})
})


router.post("/:postId{/:parentId}",isAuthenticated,multerUploadFile().single("attachment"),isValid(createCommentSchema),async (req:Request,res:Response,next:NextFunction)=>{
    const hasFile = !!req.file || (req.files && req.files.length as number > 0)
  const hasContent = !!req.body.content
  
  if (!hasFile && !hasContent) {
    throw new BadRequestException("content or attachment is required")
  }
  
   const createdComment = await commentService.create(req.body,req.params,req.user._id,req.file as unknown as Express.Multer.File)

     return successResponse({res,status:201,message:"Comment created" , data:{createdComment}})
})

router.delete("/:id",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{
  const deletedComment = await commentService.delete(new Types.ObjectId(req.params.id as string),req.user._id)
  return successResponse({res,message:"Comment deleted" ,data:{deletedComment}})
})


export default router