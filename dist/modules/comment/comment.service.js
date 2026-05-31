"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const DB_1 = require("../../DB");
const fireBase_intit_1 = require("../../common/notification/fireBase/fireBase.intit");
const cloudinary_service_1 = require("../../common/cloud/cloudinary/cloudinary.service");
class CommentService {
    postRepo;
    commentRepo;
    fireBaseNotifcationProvider;
    cloudProvider;
    constructor(postRepo, commentRepo, fireBaseNotifcationProvider, cloudProvider) {
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
        this.fireBaseNotifcationProvider = fireBaseNotifcationProvider;
        this.cloudProvider = cloudProvider;
    }
    async create(createCommentDTO, params, userId, file) {
        //check post exist 
        const postExist = await this.postRepo.getOne({ _id: params.postId });
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        if (params.parentId) {
            const parentComment = await this.commentRepo.getOne({ _id: params.parentId });
            if (!parentComment)
                throw new common_1.NotFoundException("Comment not found");
        }
        const fcmTokens = await (0, DB_1.getAllSet)(`${postExist.userId.toString()}:FCM`);
        await this.fireBaseNotifcationProvider.sendAll(fcmTokens, { title: "New comment", body: `${userId} commented on your post` });
        let attachmentFile = null;
        if (file) {
            attachmentFile = await this.cloudProvider.uploadFile(file, userId);
        }
        attachmentFile;
        //create comment
        await this.postRepo.update({ _id: params.postId }, { $inc: { commentCount: 1 } });
        return await this.commentRepo.create({ ...createCommentDTO, ...params, userId, attachment: { public_id: attachmentFile?.public_id, secure_url: attachmentFile?.secure_url } });
    }
    async get(id) {
        return await this.commentRepo.getOne({ _id: id });
    }
    async getAll(params) {
        const comments = await this.commentRepo.getAll({ postId: params.postId, parentId: params.parentId });
        if (comments.length == 0)
            throw new common_1.NotFoundException("No comments");
        return comments;
    }
    async update(updateCommentDTO, userId, id, file) {
        const commentExist = await this.commentRepo.getOne({ _id: new mongoose_1.Types.ObjectId(id), userId });
        if (!commentExist)
            throw new common_1.NotFoundException("comment not found");
        let attachmentFile = null;
        if (file) {
            attachmentFile = await this.cloudProvider.uploadFile(file, userId);
        }
        return await this.commentRepo.update({ _id: id }, { ...updateCommentDTO, attachment: { public_id: attachmentFile?.public_id, secure_url: attachmentFile?.secure_url } });
    }
    async delete(id, userId) {
        const commentExist = await this.commentRepo.getOne({ _id: id }, {}, { populate: ["postId"] });
        if (!commentExist)
            throw new common_1.NotFoundException("comment not found!");
        const commentAuthor = commentExist.userId.toString();
        const postAuthor = commentExist.postId?.userId?.toString();
        if (userId.toString() != commentAuthor && userId.toString() != postAuthor) {
            throw new common_1.UnAuthorizedException("you are not allowed");
        }
        if (commentExist.attachment?.public_id)
            await this.cloudProvider.deleteFile(commentExist.attachment?.public_id);
        return await this.commentRepo.delete({ _id: id });
    }
}
exports.default = new CommentService(new post_repository_1.PostRepository(), new comment_repository_1.CommentRepository(), fireBase_intit_1.fireBaseNotificationProvider, new cloudinary_service_1.CloudinaryProvider());
