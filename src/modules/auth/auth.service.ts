
import { Types } from 'mongoose';
import { BadRequestException, compare, ConflictException, encrypt, generateOTP, generateTokes, hash, NotFoundException, sendEmail } from '../../common';
import { deleteFromCache, getFromCache, setIntoCache } from '../../DB';
import { UserRepository } from './../../DB/models/user/user.repository';
import { ChangePasswordDTO, LoginDTO, ResetPasswordDTO, SignUpDTO, VerifyAccountDTO } from './auth.dto';


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
            
      const match = await compare(loginDTO.password,userExist.password)

      if(!match) throw new BadRequestException("invalid credentials")

        const {accessToken,refreshToken} = generateTokes({sub:userExist._id})

       await setIntoCache(`${loginDTO.email}:accessToken` , accessToken,1 * 60 * 60)
       await setIntoCache(`${loginDTO.email}:refreshToken` , refreshToken,365 * 24 * 60 * 60)
       


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

    async resetPassword (resetPasswordDTO: ResetPasswordDTO){

        const userExist = await this.userRepo.getOne({email : resetPasswordDTO.email})

        if(!userExist) throw new NotFoundException("user not found")

        const otpExist = await getFromCache(`${resetPasswordDTO.email}:otp`)

        if(otpExist != resetPasswordDTO.otp) throw new BadRequestException("invalid otp")

        resetPasswordDTO.password = await hash(resetPasswordDTO.password)

       await this.userRepo.update({email:resetPasswordDTO.email},{password:resetPasswordDTO.password})
    }

    async changePassword(changePasswordDTO :ChangePasswordDTO , userId : Types.ObjectId){
        
        const userExist =  await this.userRepo.getOne({_id: userId})
        console.log(userExist);
        
        const match = await compare(changePasswordDTO.oldPassword , userExist?.password as string)

        if(!match) throw new BadRequestException("old password is incorrect")

            changePasswordDTO.newPassword = await hash(changePasswordDTO.newPassword)

        this.userRepo.update({_id : userId},{password:changePasswordDTO.newPassword})
    }
}

export const authService = new AuthService()