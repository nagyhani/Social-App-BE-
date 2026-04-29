"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
class CommentService {
    postRepo;
    commentRepo;
    constructor(postRepo, commentRepo) {
        this.postRepo = postRepo;
        this.commentRepo = commentRepo;
    }
    async create(createCommentDTO, params, userId) {
        //check post exist 
        const postExist = await this.postRepo.getOne({ _id: params.postId });
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        if (params.parentId) {
            const parentComment = await this.commentRepo.getOne({ _id: params.parentId });
            if (!parentComment)
                throw new common_1.NotFoundException("Comment not found");
        }
        //create comment
        await this.postRepo.update({ _id: params.postId }, { $inc: { commentCount: 1 } });
        return await this.commentRepo.create({ ...createCommentDTO, ...params, userId });
    }
    async getAll(params) {
        const comments = await this.commentRepo.getAll({ postId: params.postId, parentId: params.parentId });
        if (comments.length == 0)
            throw new common_1.NotFoundException("No comments");
        return comments;
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
        return await this.commentRepo.delete({ _id: id });
    }
}
exports.default = new CommentService(new post_repository_1.PostRepository(), new comment_repository_1.CommentRepository());
