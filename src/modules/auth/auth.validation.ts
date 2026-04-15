import z, { email } from "zod";
import { generalFields, SYS_GENDER } from "../../common";


export const signUpSchema = z.object({
   userName :generalFields.userName,
   email : generalFields.email,
   password : generalFields.password,
   rePassword : generalFields.rePassword,
   phone : generalFields.phone

}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });


  export const loginSchema = z.object({
    email : generalFields.email,
     password : generalFields.password
  })


  export const verifySchema = z.object({
   email : generalFields.email,
   otp : generalFields.otp
  })

    export const sendOtpSchema = z.object({
   email : generalFields.email
  })

    export const resetPasswordSchema = z.object({
   email : generalFields.email,
   otp : generalFields.otp,
   password : generalFields.password
  })

      export const changePasswordSchema = z.object({
   email : generalFields.email,
   oldPassword : generalFields.password,
   newPassword : generalFields.password
  })

