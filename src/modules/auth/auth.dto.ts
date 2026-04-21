import { SYS_GENDER } from "../../common"

export interface SignUpDTO   {
    userName : string,
    email : string,
    password : string,
    rePassword : string,
    phone : string,
    gender? : SYS_GENDER

}


export interface LoginDTO {
    email : string,
    password : string
}

export interface VerifyAccountDTO {
    email : string,
    otp: string
}

export interface ResetPasswordDTO {
    email:string,
    otp:string,
    password : string
}

export interface ChangePasswordDTO  {
    oldPassword : string,
    newPassword : string
}