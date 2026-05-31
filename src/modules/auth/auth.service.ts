
import { Types } from 'mongoose';
import { BadRequestException, compare, ConflictException, encrypt, generateOTP, generateTokes, hash, NotFoundException, sendEmail, verifyToken } from '../../common';
import { addToSet, deleteFromCache, getFromCache, rmSet, setIntoCache } from '../../DB';
import { UserRepository } from './../../DB/models/user/user.repository';
import { ChangePasswordDTO, LoginDTO, ResetPasswordDTO, SignUpDTO, VerifyAccountDTO } from './auth.dto';
import { JwtPayload } from 'jsonwebtoken';


 class AuthService {
    private userRepo : UserRepository
    constructor(){
        this.userRepo = new UserRepository()
    }


   async signUp(signUpDTO:SignUpDTO){

        let {email,password,phone} = signUpDTO

        const userExist = await this.userRepo.getOne({email})

        if(userExist) throw new ConflictException("user already exists") 

         signUpDTO.password = await hash(signUpDTO.password)

         if(phone) signUpDTO.phone = encrypt(signUpDTO.phone)

            const otp = generateOTP()

            sendEmail({to :signUpDTO.email,subject : "confirm Email" , html: `<p>Your otp to verify account ${otp}</p>`})

           await setIntoCache(`${signUpDTO.email}:otp` , otp, 3*60)

           await setIntoCache(signUpDTO.email,JSON.stringify(signUpDTO),3*24*60*60)
    }

     async login(loginDTO:LoginDTO){

        const {email,password} = loginDTO


        const userExist = await this.userRepo.getOne({email})

        if(!userExist) throw new NotFoundException("user not found") 

             if (userExist.lockUntil && userExist.lockUntil.getTime() > Date.now()) {

     throw new BadRequestException("too many attempts, try after 5 minutes")
}

if (userExist.lockUntil && userExist.lockUntil.getTime() <= Date.now()) {
  userExist.numberOfTries = 0;
  userExist.lockUntil = null;
  await userExist.save();
}
  const match = await compare(password, userExist.password)

  if (!match){
    userExist.numberOfTries = ( userExist.numberOfTries as number) + 1 
    if(userExist.numberOfTries as number >= 5){
       userExist.lockUntil = new Date(Date.now() + 5 * 60 * 1000)
       userExist.save()
      throw new BadRequestException("too many attempts, try after 5 minutes")
    }
     await userExist.save();
    throw new NotFoundException("invalid credentials")
   
  }
            

        const blockTokenExist = await getFromCache(`${loginDTO.email}:blockedToken`) 

        if(blockTokenExist){
           await deleteFromCache(`${loginDTO.email}:blockedToken`)
        }

        const {accessToken,refreshToken} = generateTokes({sub:userExist._id as unknown as string})

       await setIntoCache(`${loginDTO.email}:accessToken` , accessToken,1 * 60 * 60)
       await setIntoCache(`${loginDTO.email}:refreshToken` , refreshToken,365 * 24 * 60 * 60)

       if(loginDTO.FCM){

        await addToSet(`${userExist._id.toString()}:FCM`, loginDTO.FCM )
       }
       
        return {accessToken,refreshToken}
    }
    

    async refreshToken(headers:string,email:string){

  const payLoad:JwtPayload = verifyToken(headers,"klashweiufyiewoyf6465f4wefjuwegfiugwfguiowegf",)

  delete payLoad.iat
  delete payLoad.exp

  const {accessToken,refreshToken} = generateTokes({sub:payLoad.sub})

       await setIntoCache(`${email}:accessToken` , accessToken,1 * 60 * 60)
       await setIntoCache(`${email}:refreshToken` , refreshToken,365 * 24 * 60 * 60)
       
        return {accessToken,refreshToken}
    }


    async verifyAccount(verifyAccountDTO:VerifyAccountDTO){

       const userData = await getFromCache(verifyAccountDTO.email)
       if(!userData) throw new NotFoundException("user not found")

       const otp =  await getFromCache(`${verifyAccountDTO.email}:otp`)
       if(!otp) throw new BadRequestException("otp expired !")

        if(otp != verifyAccountDTO.otp) throw new BadRequestException("invalid otp")

        await this.userRepo.create(JSON.parse(userData))

        await deleteFromCache(`${verifyAccountDTO.email}:otp`)
        await deleteFromCache(`${verifyAccountDTO.email}`)

    }


    async sendOtp(email:string){

      const userExistIntoDB =  await this.userRepo.getOne({email})
    
      
      const userExistIntoCache = await getFromCache(email)

      if(!userExistIntoCache&& !userExistIntoDB) throw new NotFoundException("user not found, go signup")

        const otpExist = await getFromCache(`${email}:otp`)

        if(otpExist) throw new BadRequestException("OTP still valid!")

            const otp =  generateOTP()

           await sendEmail({to: email,subject : "re-sent otp" , html: `<p>Your 
            otp ${otp}</p>`})

            await setIntoCache(`${email}:otp`,otp,3*60)

    }

    async resetPassword (resetPasswordDTO: ResetPasswordDTO,email:string,tokePayload:JwtPayload){

        const userExist = await this.userRepo.getOne({email : resetPasswordDTO.email})

        if(!userExist) throw new NotFoundException("user not found")

        const otpExist = await getFromCache(`${resetPasswordDTO.email}:otp`)

        if(otpExist != resetPasswordDTO.otp) throw new BadRequestException("invalid otp")

        resetPasswordDTO.password = await hash(resetPasswordDTO.password)

          await setIntoCache(`${email}:blockedToken` , tokePayload.jti as string,(tokePayload.exp as number) * 1000  )

       await this.userRepo.update({email:resetPasswordDTO.email},{password:resetPasswordDTO.password})
    }

    async changePassword(changePasswordDTO :ChangePasswordDTO , userId : Types.ObjectId,email:string,tokePayload:JwtPayload){
        
        const userExist =  await this.userRepo.getOne({_id: userId})
        
        const match = await compare(changePasswordDTO.oldPassword , userExist?.password as string)

        if(!match) throw new BadRequestException("old password is incorrect")

            changePasswordDTO.newPassword = await hash(changePasswordDTO.newPassword)

             await setIntoCache(`${email}:blockedToken` , tokePayload.jti as string,(tokePayload.exp as number) * 1000  )

        this.userRepo.update({_id : userId},{password:changePasswordDTO.newPassword})
    }

    async logOutFromAllDevices(userId:Types.ObjectId){

       return await this.userRepo.update({_id:userId},{credentialsUpdatedAt: Date.now() })

    }

    async logOut(tokenPayload:JwtPayload,email:string,FCM:string,userId:string){

        await setIntoCache(`${email}:blockedToken` , tokenPayload.jti as string,(tokenPayload.exp as number) * 1000  )
        await rmSet(`${userId}:FCM`,FCM)

    }
}

export const authService = new AuthService()