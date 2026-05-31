"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const common_1 = require("../../common");
const DB_1 = require("../../DB");
const user_repository_1 = require("./../../DB/models/user/user.repository");
class AuthService {
    userRepo;
    constructor() {
        this.userRepo = new user_repository_1.UserRepository();
    }
    async signUp(signUpDTO) {
        let { email, password, phone } = signUpDTO;
        const userExist = await this.userRepo.getOne({ email });
        if (userExist)
            throw new common_1.ConflictException("user already exists");
        signUpDTO.password = await (0, common_1.hash)(signUpDTO.password);
        if (phone)
            signUpDTO.phone = (0, common_1.encrypt)(signUpDTO.phone);
        const otp = (0, common_1.generateOTP)();
        (0, common_1.sendEmail)({ to: signUpDTO.email, subject: "confirm Email", html: `<p>Your otp to verify account ${otp}</p>` });
        await (0, DB_1.setIntoCache)(`${signUpDTO.email}:otp`, otp, 3 * 60);
        await (0, DB_1.setIntoCache)(signUpDTO.email, JSON.stringify(signUpDTO), 3 * 24 * 60 * 60);
    }
    async login(loginDTO) {
        const { email, password } = loginDTO;
        const userExist = await this.userRepo.getOne({ email });
        if (!userExist)
            throw new common_1.NotFoundException("user not found");
        if (userExist.lockUntil && userExist.lockUntil.getTime() > Date.now()) {
            throw new common_1.BadRequestException("too many attempts, try after 5 minutes");
        }
        if (userExist.lockUntil && userExist.lockUntil.getTime() <= Date.now()) {
            userExist.numberOfTries = 0;
            userExist.lockUntil = null;
            await userExist.save();
        }
        const match = await (0, common_1.compare)(password, userExist.password);
        if (!match) {
            userExist.numberOfTries = userExist.numberOfTries + 1;
            if (userExist.numberOfTries >= 5) {
                userExist.lockUntil = new Date(Date.now() + 5 * 60 * 1000);
                userExist.save();
                throw new common_1.BadRequestException("too many attempts, try after 5 minutes");
            }
            await userExist.save();
            throw new common_1.NotFoundException("invalid credentials");
        }
        const blockTokenExist = await (0, DB_1.getFromCache)(`${loginDTO.email}:blockedToken`);
        if (blockTokenExist) {
            await (0, DB_1.deleteFromCache)(`${loginDTO.email}:blockedToken`);
        }
        const { accessToken, refreshToken } = (0, common_1.generateTokes)({ sub: userExist._id });
        await (0, DB_1.setIntoCache)(`${loginDTO.email}:accessToken`, accessToken, 1 * 60 * 60);
        await (0, DB_1.setIntoCache)(`${loginDTO.email}:refreshToken`, refreshToken, 365 * 24 * 60 * 60);
        if (loginDTO.FCM) {
            await (0, DB_1.addToSet)(`${userExist._id.toString()}:FCM`, loginDTO.FCM);
        }
        return { accessToken, refreshToken };
    }
    async refreshToken(headers, email) {
        const payLoad = (0, common_1.verifyToken)(headers, "klashweiufyiewoyf6465f4wefjuwegfiugwfguiowegf");
        delete payLoad.iat;
        delete payLoad.exp;
        const { accessToken, refreshToken } = (0, common_1.generateTokes)({ sub: payLoad.sub });
        await (0, DB_1.setIntoCache)(`${email}:accessToken`, accessToken, 1 * 60 * 60);
        await (0, DB_1.setIntoCache)(`${email}:refreshToken`, refreshToken, 365 * 24 * 60 * 60);
        return { accessToken, refreshToken };
    }
    async verifyAccount(verifyAccountDTO) {
        const userData = await (0, DB_1.getFromCache)(verifyAccountDTO.email);
        if (!userData)
            throw new common_1.NotFoundException("user not found");
        const otp = await (0, DB_1.getFromCache)(`${verifyAccountDTO.email}:otp`);
        if (!otp)
            throw new common_1.BadRequestException("otp expired !");
        if (otp != verifyAccountDTO.otp)
            throw new common_1.BadRequestException("invalid otp");
        await this.userRepo.create(JSON.parse(userData));
        await (0, DB_1.deleteFromCache)(`${verifyAccountDTO.email}:otp`);
        await (0, DB_1.deleteFromCache)(`${verifyAccountDTO.email}`);
    }
    async sendOtp(email) {
        const userExistIntoDB = await this.userRepo.getOne({ email });
        const userExistIntoCache = await (0, DB_1.getFromCache)(email);
        if (!userExistIntoCache && !userExistIntoDB)
            throw new common_1.NotFoundException("user not found, go signup");
        const otpExist = await (0, DB_1.getFromCache)(`${email}:otp`);
        if (otpExist)
            throw new common_1.BadRequestException("OTP still valid!");
        const otp = (0, common_1.generateOTP)();
        await (0, common_1.sendEmail)({ to: email, subject: "re-sent otp", html: `<p>Your 
            otp ${otp}</p>` });
        await (0, DB_1.setIntoCache)(`${email}:otp`, otp, 3 * 60);
    }
    async resetPassword(resetPasswordDTO, email, tokePayload) {
        const userExist = await this.userRepo.getOne({ email: resetPasswordDTO.email });
        if (!userExist)
            throw new common_1.NotFoundException("user not found");
        const otpExist = await (0, DB_1.getFromCache)(`${resetPasswordDTO.email}:otp`);
        if (otpExist != resetPasswordDTO.otp)
            throw new common_1.BadRequestException("invalid otp");
        resetPasswordDTO.password = await (0, common_1.hash)(resetPasswordDTO.password);
        await (0, DB_1.setIntoCache)(`${email}:blockedToken`, tokePayload.jti, tokePayload.exp * 1000);
        await this.userRepo.update({ email: resetPasswordDTO.email }, { password: resetPasswordDTO.password });
    }
    async changePassword(changePasswordDTO, userId, email, tokePayload) {
        const userExist = await this.userRepo.getOne({ _id: userId });
        const match = await (0, common_1.compare)(changePasswordDTO.oldPassword, userExist?.password);
        if (!match)
            throw new common_1.BadRequestException("old password is incorrect");
        changePasswordDTO.newPassword = await (0, common_1.hash)(changePasswordDTO.newPassword);
        await (0, DB_1.setIntoCache)(`${email}:blockedToken`, tokePayload.jti, tokePayload.exp * 1000);
        this.userRepo.update({ _id: userId }, { password: changePasswordDTO.newPassword });
    }
    async logOutFromAllDevices(userId) {
        return await this.userRepo.update({ _id: userId }, { credentialsUpdatedAt: Date.now() });
    }
    async logOut(tokenPayload, email, FCM, userId) {
        await (0, DB_1.setIntoCache)(`${email}:blockedToken`, tokenPayload.jti, tokenPayload.exp * 1000);
        await (0, DB_1.rmSet)(`${userId}:FCM`, FCM);
    }
}
exports.authService = new AuthService();
