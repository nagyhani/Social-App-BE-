import z from "zod";
import { SYS_GENDER, SYS_REACTION } from "../enums";

export const generalFields = {
     userName : z.string({message : "Name is required"}).min(2,{message:"min char is 2 "}).max(20,{message:"max char is 20 "}).regex(/^(?!\d+$)[a-zA-Z][a-zA-Z0-9]*$/),
    email : z.email({message:"invalid email pattern EX : johndoe123@gmail.com"}),
    password : z.string({message : "password is required"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message : "password must be At least 8 characters long ,Contains at least one uppercase letter,Contains at least one lowercase letter,Contains at least one digit,Contains at least one special character (e.g., @$!%*?&)"}),
    rePassword : z.string({message : "rePassword is required"}),
    gender : z.enum(SYS_GENDER).optional(),
    phone : z.string({message : "Phone is required"}).regex(/^(?:\+20|0)?1[0125][0-9]{8}$/,{message:"number invalid"}),
    otp : z.string({message:"OTP is required"}).regex(/^\d{6}$/,{message:"otp should be six numbers"}),
    content : z.string().optional(),
    attachments : z.array(z.string()).optional(),
    reaction : z.enum(SYS_REACTION),
    id : z.string()
}