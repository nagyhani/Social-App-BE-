import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../DB/models/user/user.repository";
import { BadRequestException, NotFoundException, verifyToken } from "../common";
import { JwtPayload, verify } from "jsonwebtoken";
import { getFromCache } from "../DB";
import { ACCESS_TOKEN_SECRET } from "../config";

 export const isAuthenticated = async(req:Request,res:Response,next:NextFunction)=>{


     const {authorization} = req.headers

     const userRepo = new UserRepository
    
      const payLoad = verifyToken(authorization as string,ACCESS_TOKEN_SECRET,) as JwtPayload

      const user = await userRepo.getOne({_id : payLoad.sub})
      if(!user) throw new NotFoundException("user not found")

        
        if (!payLoad.iat) {
  throw new BadRequestException("Invalid token: missing iat");
}

if (
  new Date(user.credentialsUpdatedAt).getTime() >
  payLoad.iat * 1000
) {
  throw new BadRequestException("invalid token");
}

       const tokenExist = await getFromCache(`${user.email}:blockedToken`)

       if(tokenExist) throw new BadRequestException("invalid Token!")


        req.user = user
       req.payload = payLoad

        next()
     
  
 }


 export const isAuthGQL = async(context:any)=>{

    const authorization = context?.headers?.authorization;

  if (!authorization) {
    throw new BadRequestException("Authorization header is required");
  }
  const token = authorization.split(" ")[1]

  if(!token) throw new BadRequestException("Token is required")

    const payload = verify(token,ACCESS_TOKEN_SECRET)

    context.payLoad = payload

    return
 }