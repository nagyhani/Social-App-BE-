import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import { addReaction, BadRequestException, successResponse } from "../../common";
import { addReactionSchema, createPostSchema } from "./post.validation";
import postService from "./post.service";
import { postRepo } from "../../DB/models/post/post.repository";
import { multerUploadFile } from "../../common/utils/multer.utils";


const router = Router()


router.post( "/",isAuthenticated, multerUploadFile().array("attachments"),isValid(createPostSchema),async (req, res, next) => {

    const hasFile = !!req.file || (req.files && req.files.length as number > 0)
  const hasContent = !!req.body.content
  
  if (!hasFile && !hasContent) {
    throw new BadRequestException("content or attachment is required")
  }
    const post = await postService.create(req.body, req.user._id, req.files as Express.Multer.File[])

    return successResponse({
      res,
      status: 201,
      message: "post created successfully",
      data: post
    })
  }
)

router.post("/add-reaction",isAuthenticated,isValid(addReactionSchema),async (req:Request,res:Response,next:NextFunction)=>{

  await addReaction(req.body,req.user._id,postRepo)

   return successResponse({res,message:"done"})

})

router.get("/posts/:userId" , isAuthenticated , async (req:Request,res:Response,next:NextFunction)=>{
    
  const posts =  await postService.getAll(req.params.userId as string)

  return successResponse({res,message:"done" , data:posts})
})

router.get("/:postId" , isAuthenticated , async (req:Request,res:Response,next:NextFunction)=>{
    
  const post =  await postService.get(req.params.postId as string)

  return successResponse({res,message:"done" , data:post})
})

router.patch("/:postId" ,isAuthenticated,multerUploadFile().array("attachments"),isValid(createPostSchema),async (req:Request,res:Response,next:NextFunction)=>{

    const hasFile = !!req.file || (req.files && req.files.length as number > 0)
  const hasContent = !!req.body.content
  
  if (!hasFile && !hasContent) {
    throw new BadRequestException("content or attachment is required")
  }
    const post = await postService.update(req.body,req.params.postId as string,req.user._id,req.files as Express.Multer.File[])

    return successResponse({res,message:"done" , data:post})
})

router.delete("/:postId" , isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{

  await postService.delete(req.params.postId as string,req.user._id)

    return successResponse({res,message:"Post deleted"})
})



export default router