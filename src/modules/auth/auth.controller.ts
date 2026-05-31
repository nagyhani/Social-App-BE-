import {Router } from "express";
import type { NextFunction, Request, Response,} from "express"
import { isAuthenticated, isValid } from "../../middleware";
import { changePasswordSchema, loginSchema, resetPasswordSchema, sendOtpSchema, signUpSchema, verifySchema } from "./auth.validation";
import { authService } from "./auth.service";
import { successResponse } from "../../common";


const router = Router()


router.post("/signup",isValid(signUpSchema), async(req:Request,res:Response,next:NextFunction)=>{

  await authService.signUp(req.body)

    return successResponse({res,status:201,message:"done"})
})


router.post("/login",isValid(loginSchema),async(req:Request,res:Response,next:NextFunction)=>{

    const {accessToken,refreshToken} = await authService.login(req.body)

    return successResponse({res,success:true,message:"done",data : {accessToken,refreshToken}})
})

router.post("/verify-account",isValid(verifySchema),async(req:Request,res:Response,next:NextFunction)=>{

   await authService.verifyAccount(req.body)
      return successResponse({res,status:201,message:"user created successfully"})
})

router.post("/send-otp",isValid(sendOtpSchema),async(req:Request,res:Response,next:NextFunction)=>{
    
   await authService.sendOtp(req.body.email)

    return successResponse({res,message:"otp sent successfully"})
})

router.patch("/reset-password",isAuthenticated,isValid(resetPasswordSchema),async(req:Request,res:Response,next:NextFunction)=>{
    
   await authService.resetPassword(req.body,req.user.email,req.payload)

    return successResponse({res,message:"password updated successfully"})
})

router.patch("/change-password",isAuthenticated,isValid(changePasswordSchema),async(req:Request,res:Response,next:NextFunction)=>{
    
   await authService.changePassword(req.body,req.user._id,req.user.email,req.payload)

    return successResponse({res,message:"password changed successfully"})
})

router.get("/refresh-token",async(req:Request,res:Response,next:NextFunction)=>{

   const {accessToken,refreshToken} =  await authService.refreshToken(req.headers.authorization as string,req.body)
    
    return successResponse({res,message:"done" , data:{accessToken,refreshToken}})
})

router.patch("/log-out-from-all-devices",isAuthenticated,async(req:Request,res:Response,next:NextFunction)=>{
    await authService.logOutFromAllDevices(req.user._id)

    return successResponse({res,message:"done"})
})

router.post("/log-out",isAuthenticated,async(req:Request,res:Response,next:NextFunction)=>{

    await authService.logOut(req.payload,req.user.email,req.body,req.user._id)

    return successResponse({res,message:"done"})
})


export default router