"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_repository_1 = require("../../DB/models/request/request.repository");
const common_1 = require("../../common");
const user_friend_repository_1 = require("../../DB/models/user-friend/user-friend.repository");
const user_repository_1 = require("../../DB/models/user/user.repository");
class RequestService {
    requestRepo;
    userFriendRepo;
    userRepo;
    constructor(requestRepo, userFriendRepo, userRepo) {
        this.requestRepo = requestRepo;
        this.userFriendRepo = userFriendRepo;
        this.userRepo = userRepo;
    }
    async create(senderId, receiverId) {
        if (senderId.toString() == receiverId.toString())
            throw new common_1.BadRequestException("senderId cant equals receiverId");
        const userFriendExist = await this.userFriendRepo.getOne({ $or: [{ user: senderId, friend: receiverId }, { user: receiverId, friend: senderId }] });
        if (userFriendExist)
            throw new common_1.BadRequestException("you already friends");
        // check receiver 
        const receiverExist = await this.userRepo.getOne({ _id: receiverId });
        if (!receiverExist)
            throw new common_1.NotFoundException("user not found");
        // check request
        const requestExist = await this.requestRepo.getOne({ $or: [{ sender: senderId, receiver: receiverId }, { sender: receiverId, receiver: senderId }] });
        if (requestExist)
            throw new common_1.ConflictException("Request already sent");
        // create request
        return await this.requestRepo.create({ sender: senderId, receiver: receiverId });
    }
    async getAll(userId) {
        return await this.requestRepo.getAll({ $or: [{ sender: userId }, { receiver: userId }] });
    }
    async acceptRequest(userId, id) {
        // check request
        const requestExist = await this.requestRepo.getOne({ _id: id });
        if (!requestExist)
            throw new common_1.NotFoundException("No request found");
        // check only receiver accepts the request
        if (!requestExist.receiver.equals(userId))
            throw new common_1.UnAuthorizedException("you can't accept this request");
        // delete request
        await this.requestRepo.delete({ _id: id });
        //create user-friend
        await this.userFriendRepo.create({ user: userId, friend: requestExist.sender });
    }
    async declineRequest(userId, id) {
        // check request 
        const requestExist = await this.requestRepo.getOne({ _id: id });
        if (!requestExist)
            throw new common_1.NotFoundException("request not found");
        if (!userId.equals(requestExist.receiver) && !userId.equals(requestExist.sender))
            throw new common_1.UnAuthorizedException("you are not authorized to cancel request");
        return await this.requestRepo.delete({ _id: id });
    }
    async removeFriend(userId, friendId) {
        if (userId.toString() == friendId.toString())
            throw new common_1.BadRequestException("senderId cant equals receiverId");
        // check userFriend
        const userFriendExist = await this.userFriendRepo.getOne({ $or: [{ user: userId, friend: friendId }, { user: friendId, friend: userId }] });
        if (!userFriendExist)
            throw new common_1.NotFoundException("you are not friends");
        // remove friend
        return await this.userFriendRepo.delete({ _id: userFriendExist._id });
    }
}
exports.default = new RequestService(new request_repository_1.RequestRepo(), new user_friend_repository_1.UserFriendRepo(), new user_repository_1.UserRepository());
