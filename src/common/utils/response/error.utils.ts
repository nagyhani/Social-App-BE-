import { NextFunction, Request, Response } from "express"

export class ConflictException extends Error {

    constructor(message:string){
        super(message , {cause :409})
    }
}

export class NotFoundException extends Error {

    constructor(message:string){
        super(message , {cause :404})
    }
}

export class UnAuthorizedException extends Error {

    constructor(message:string){
        super(message , {cause :401})
    }
}


export class BadRequestException extends Error {

    constructor(message:string, public details?: Record<string,string>[]){
        super(message , {cause :400})
    }
}




export const errorGlobalHandler = (error:Error, req:Request, res:Response, next : NextFunction)=>{
    const status = error.cause || 500
    return res.status(status as number).json({
        error : error,
        message : error.message,
         success: false,
        stack : error.stack
    })
}