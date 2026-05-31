"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const comment_repository_1 = require("../comment/comment.repository");
const post_repository_1 = require("../post/post.repository");
const request_repository_1 = require("../request/request.repository");
const user_friend_repository_1 = require("../user-friend/user-friend.repository");
const user_reaction_repository_1 = require("../user-reaction/user-reaction.repository");
const story_repository_1 = require("../story/story.repository");
const schema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: function () {
            if (this.provider === common_1.SYS_PROVIDER.google)
                return false;
            return true;
        } },
    phone: { type: String },
    email: { type: String, required: true },
    profilePic: String,
    gender: { type: Number, enum: common_1.SYS_GENDER },
    role: { type: Number, enum: common_1.SYS_ROLE, default: common_1.SYS_ROLE.user },
    provider: { type: Number, enum: common_1.SYS_PROVIDER, default: common_1.SYS_PROVIDER.system },
    credentialsUpdatedAt: { type: Date, default: Date.now() },
    lockUntil: Date,
    numberOfTries: { type: Number, default: 0 }
}, { timestamps: true });
schema.pre("deleteOne", async function () {
    const filter = this.getFilter();
    const createdComments = await comment_repository_1.commentRepo.getAll({ userId: filter._id });
    const createdPosts = await post_repository_1.postRepo.getAll({ userId: filter._id });
    const createdRequests = await request_repository_1.requestRepo.getAll({ userId: filter._id });
    const friends = await user_friend_repository_1.userFriendRepo.getAll({ $or: [{ user: filter._id }, { friend: filter._id }] });
    const reactions = await user_reaction_repository_1.userReactionRepo.getAll({ userId: filter._id });
    const stories = await story_repository_1.storyRepo.getAll({ userId: filter._id });
    if (createdComments?.length > 0) {
        for (const createdComment of createdComments) {
            await comment_repository_1.commentRepo.delete({ _id: createdComment._id });
        }
    }
    if (createdPosts?.length > 0) {
        for (const createdPost of createdPosts) {
            await post_repository_1.postRepo.delete({ _id: createdPost._id });
        }
    }
    if (createdRequests?.length > 0) {
        for (const createdRequest of createdRequests) {
            await request_repository_1.requestRepo.delete({ _id: createdRequest._id });
        }
    }
    if (friends?.length > 0) {
        for (const friend of friends) {
            await user_friend_repository_1.userFriendRepo.delete({ _id: friend._id });
        }
    }
    if (reactions?.length > 0) {
        for (const reaction of reactions) {
            await user_reaction_repository_1.userReactionRepo.delete({ _id: reaction._id });
        }
    }
    if (stories?.length > 0) {
        for (const story of stories) {
            await story_repository_1.storyRepo.delete({ _id: story._id });
        }
    }
});
exports.User = (0, mongoose_1.model)("User", schema);
