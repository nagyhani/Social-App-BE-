import { Router } from "express";
import type {NextFunction, Request, Response} from "express"
import { isAuthenticated } from "../../middleware";
import requestService from "./request.service";
import { Types } from "mongoose";
import { successResponse } from "../../common";


const router = Router()


router.post("/accept/:requestId",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{

    await requestService.acceptRequest(req.user._id,new Types.ObjectId(req.params.requestId as string))

    return successResponse({res,message:"request accepted "})
})


router.post("/:receiverId", isAuthenticated, async (req:Request,res:Response,next:NextFunction)=>{

   const request =  await requestService.create(req.user._id, new Types.ObjectId(req.params.receiverId as string))

   return successResponse({status:201,res,message:"done",data:{request}})
})

router.delete("/decline/:requestId",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{
    await requestService.declineRequest(req.user._id,new Types.ObjectId(req.params.requestId as string))

    return successResponse({res,message:"request declined"})
})


router.delete("/remove/:friendId",isAuthenticated,async (req:Request,res:Response,next:NextFunction)=>{

    await requestService.removeFriend(req.user._id,new Types.ObjectId(req.params.friendId as string))

    return successResponse({res,message:"friend removed"})
})


export default router