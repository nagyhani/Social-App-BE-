import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import commentService from "./comment.service";
import { addReaction, successResponse } from "../../common";
import { addReactionSchema } from "../post/post.validation";
import { commentRepo} from "../../DB/models/comment/comment.repository";


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


router.post("/:postId{/:parentId}",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{

   const createdComment = await commentService.create(req.body,req.params,req.user._id)

     return successResponse({res,status:201,message:"Comment created" , data:{createdComment}})
})


export default router