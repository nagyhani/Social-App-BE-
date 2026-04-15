import { SYS_GENDER } from "../../common"

export type SignUpDTO =  {
    userName : string,
    email : string,
    password : string,
    rePassword : string,
    phone : string,
    gender? : SYS_GENDER

}


export type LoginDTO = {
    email : string,
    password : string
}

export type VerifyAccountDTO = {
    email : string,
    otp: string
}

export type ResetPasswordDTO = {
    email:string,
    otp:string,
    password : string
}

export type ChangePasswordDTO = {
     email:string,
    oldPassword : string,
    newPassword : string
}