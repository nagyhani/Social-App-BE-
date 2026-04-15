"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const user_repository_1 = require("../DB/models/user/user.repository");
const common_1 = require("../common");
const DB_1 = require("../DB");
const isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    const userRepo = new user_repository_1.UserRepository;
    const payLoad = (0, common_1.verifyToken)(authorization, "kljfpiofieqihrriohepoighoiwvhtuwihuvsvsvsdvsgdrghfsfdshyyhetn");
    const user = await userRepo.getOne({ _id: payLoad.sub });
    if (!user)
        throw new common_1.NotFoundException("user not found");
    if (!payLoad.iat) {
        throw new common_1.BadRequestException("Invalid token: missing iat");
    }
    // if (
    //   new Date(user.credentialsUpdatedAt).getTime() >
    //   payLoad.iat * 1000
    // ) {
    //   throw new BadRequestException("invalid token");
    // }
    const tokenExist = await (0, DB_1.getFromCache)(`$${user.email}:accessToken`);
    if (tokenExist)
        throw new common_1.BadRequestException("invalid Token!");
    req.user = user;
    req.payload = payLoad;
    next();
};
exports.isAuthenticated = isAuthenticated;
