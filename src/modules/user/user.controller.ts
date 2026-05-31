import { NextFunction, Request, Response, Router } from "express";
import { isAuthenticated, isValid } from "../../middleware";
import userService from "./user.service";
import { successResponse } from "../../common";
import { updateUserSchema } from "./user.validation";
import { Types } from "mongoose";


const router = Router()


router.get("/",isAuthenticated,async(req:Request,res:Response,next:NextFunction)=>{

   const {friends,user} = await userService.get(req.user._id as Types.ObjectId)

   return successResponse({res,message:"done",data:{user,friends}})
})

router.get("/feed",isAuthenticated,async(req:Request,res:Response,next:NextFunction)=>{

    const data = await userService.feed(req.user._id as Types.ObjectId)

    return successResponse({res,message:"done",data:{data}})
})

router.get("/dash-board",isAuthenticated,async(req:Request,res:Response,next:NextFunction)=>{

    const data = await userService.dashboard(req.user._id as Types.ObjectId)

    return successResponse({res,message:"done",data:{data}})
})

router.patch("/",isAuthenticated,isValid(updateUserSchema),async(req:Request,res:Response,next:NextFunction)=>{

    const updatedUser = await userService.update(req.body,req.user._id,req.payload)

    return successResponse({res,status:201,message:"done",data:{updatedUser}})
})

router.delete("/",isAuthenticated,async(req:Request,res:Response,next:NextFunction)=>{

    await userService.delete(req.user._id)
    return successResponse({res,message:"done"})
})


export default router