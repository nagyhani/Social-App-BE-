"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthGQL = exports.isAuthenticated = void 0;
const user_repository_1 = require("../DB/models/user/user.repository");
const common_1 = require("../common");
const jsonwebtoken_1 = require("jsonwebtoken");
const DB_1 = require("../DB");
const config_1 = require("../config");
const isAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    const userRepo = new user_repository_1.UserRepository;
    const payLoad = (0, common_1.verifyToken)(authorization, config_1.ACCESS_TOKEN_SECRET);
    const user = await userRepo.getOne({ _id: payLoad.sub });
    if (!user)
        throw new common_1.NotFoundException("user not found");
    if (!payLoad.iat) {
        throw new common_1.BadRequestException("Invalid token: missing iat");
    }
    if (new Date(user.credentialsUpdatedAt).getTime() >
        payLoad.iat * 1000) {
        throw new common_1.BadRequestException("invalid token");
    }
    const tokenExist = await (0, DB_1.getFromCache)(`${user.email}:blockedToken`);
    if (tokenExist)
        throw new common_1.BadRequestException("invalid Token!");
    req.user = user;
    req.payload = payLoad;
    next();
};
exports.isAuthenticated = isAuthenticated;
const isAuthGQL = async (context) => {
    const authorization = context?.headers?.authorization;
    if (!authorization) {
        throw new common_1.BadRequestException("Authorization header is required");
    }
    const token = authorization.split(" ")[1];
    if (!token)
        throw new common_1.BadRequestException("Token is required");
    const payload = (0, jsonwebtoken_1.verify)(token, config_1.ACCESS_TOKEN_SECRET);
    context.payLoad = payload;
    return;
};
exports.isAuthGQL = isAuthGQL;
