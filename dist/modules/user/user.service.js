"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_repository_1 = require("../../DB/models/user/user.repository");
const common_1 = require("../../common");
const DB_1 = require("../../DB");
const user_friend_repository_1 = require("./../../DB/models/user-friend/user-friend.repository");
const post_repository_1 = require("../../DB/models/post/post.repository");
const story_repository_1 = require("../../DB/models/story/story.repository");
class UserService {
    userRepo;
    userFriendRepo;
    postRepo;
    storyRepo;
    constructor(userRepo, userFriendRepo, postRepo, storyRepo) {
        this.userRepo = userRepo;
        this.userFriendRepo = userFriendRepo;
        this.postRepo = postRepo;
        this.storyRepo = storyRepo;
    }
    async get(userId) {
        const user = await this.userRepo.getOne({ _id: new mongoose_1.Types.ObjectId(userId) });
        if (!user)
            throw new common_1.NotFoundException("user not found");
        const friends = await this.userFriendRepo.getAll({ $or: [{ user: userId }, { friend: userId }] }, {}, { populate: [{ path: "user" }, { path: "friend" }] });
        return { friends, user };
    }
    async feed(userId) {
        const friends = await this.userFriendRepo.getAll({ user: userId });
        const friendIds = friends.map(friend => friend.friend);
        const posts = await this.postRepo.getAll({
            userId: { $in: [...friendIds, userId] }
        });
        return posts;
    }
    async dashboard(userId) {
        const friends = await this.userFriendRepo.getAll({ user: userId });
        const friendIds = friends.map(f => f.friend);
        const posts = await this.postRepo.getAll({
            userId: { $in: [...friendIds, userId] }
        }, {
            sort: { createdAt: -1 },
            limit: 20
        });
        const stories = await this.storyRepo.getAll({
            userId: { $in: [...friendIds, userId] }
        });
        return {
            posts,
            stories
        };
    }
    async update(updateUserDTO, userId, tokenPayload) {
        const user = await this.userRepo.getOne({ _id: userId });
        if (!user)
            throw new common_1.NotFoundException("user not found");
        if (updateUserDTO.email) {
            await (0, DB_1.setIntoCache)(`${updateUserDTO.email}:blockedToken`, tokenPayload.jti, tokenPayload.exp * 1000);
        }
        if (updateUserDTO.phone)
            updateUserDTO.phone = (0, common_1.encrypt)(updateUserDTO.phone);
        const updatedUser = await this.userRepo.update({ _id: userId }, updateUserDTO);
        return updatedUser;
    }
    async delete(userId) {
        const userExist = await this.userRepo.getOne({ _id: userId });
        if (!userExist)
            throw new common_1.NotFoundException("user not found");
        await this.userRepo.delete({ _id: userId });
    }
}
exports.default = new UserService(new user_repository_1.UserRepository(), new user_friend_repository_1.UserFriendRepo(), new post_repository_1.PostRepository(), new story_repository_1.StoryRepository());
