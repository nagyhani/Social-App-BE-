import z from "zod";
import { generalFields } from "../../common";

  export const updateUserSchema = z.object({
    userName : z.string().min(2,{message:"min char is 2 "}).max(20,{message:"max char is 20 "}).regex(/^(?!\d+$)[a-zA-Z][a-zA-Z0-9]*$/).optional(),
    email : z.email({message:"invalid email pattern EX : johndoe123@gmail.com"}).optional(),
   password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,{message : "password must be At least 8 characters long ,Contains at least one uppercase letter,Contains at least one lowercase letter,Contains at least one digit,Contains at least one special character (e.g., @$!%*?&)"}).optional(),
     phone : z.string().regex(/^(?:\+20|0)?1[0125][0-9]{8}$/,{message:"number invalid"}).optional(),
  

  })