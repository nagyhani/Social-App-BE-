"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
const cloudinary_service_1 = require("../../common/cloud/cloudinary/cloudinary.service");
class PostService {
    postRepo;
    userReactionRepo;
    cloudProvider;
    constructor(postRepo, userReactionRepo, cloudProvider) {
        this.postRepo = postRepo;
        this.userReactionRepo = userReactionRepo;
        this.cloudProvider = cloudProvider;
    }
    async create(createPostDTO, userId, files) {
        const uploadedImages = [];
        for (const file of files) {
            const result = await this.cloudProvider.uploadFile(file, userId);
            uploadedImages.push({
                secure_url: result.secure_url,
                public_id: result.public_id
            });
        }
        return this.postRepo.create({
            ...createPostDTO,
            attachments: uploadedImages,
            userId
        });
    }
    // async addReaction(addReactionDTO: AddReactionDTO , userId:Types.ObjectId){
    //       // check post exist
    //   const postExist =  await this.postRepo.getOne({_id : addReactionDTO.id})
    //   if(!postExist) throw new NotFoundException("Post not found")
    //     //check user reactions
    //   const userReaction =  await this.userReactionRepo.getOne({onModel:ON_MODEL.Post,refId:addReactionDTO.id,userId})
    //   // if no reaction
    //   if(!userReaction){
    //    await this.userReactionRepo.create({onModel:ON_MODEL.Post,refId:addReactionDTO.id ,userId,reaction:addReactionDTO.reaction})
    //    await this.postRepo.update({_id:addReactionDTO.id},{$inc:{reactionCount : 1}})
    //    return;
    //   }
    //   // same reaction
    //   if(userReaction.reaction == addReactionDTO.reaction){
    //     await this.postRepo.update({_id:addReactionDTO.id},{$inc:{reactionCount : -1}})
    //     await this.userReactionRepo.delete({_id : userReaction._id})
    //     return
    //   }
    //   // different reaction
    //  await this.userReactionRepo.update({_id:userReaction._id},{reaction:addReactionDTO.reaction})
    // }
    async get(params) {
        // check post exist
        const postExist = await this.postRepo.getOne({ _id: params });
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        //get post
        return postExist;
    }
    async getAll(params) {
        // check posts exist
        const postsExist = await this.postRepo.getAll({ userId: params });
        if (postsExist.length === 0)
            throw new common_1.NotFoundException("no posts exists");
        //get post
        return postsExist;
    }
    async update(updatedPostDTO, params, userId, files) {
        // check post exist
        const postExist = await this.postRepo.getOne({ _id: params });
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        if (postExist.userId.toString() != userId.toString())
            throw new common_1.UnAuthorizedException(" you can't update this post");
        const uploadedImages = [];
        for (const file of files) {
            const result = await this.cloudProvider.uploadFile(file, userId);
            uploadedImages.push({
                secure_url: result.secure_url,
                public_id: result.public_id
            });
        }
        updatedPostDTO.attachments = uploadedImages;
        const updatedPost = await this.postRepo.update({ _id: params }, updatedPostDTO);
        return updatedPost;
    }
    async delete(params, userId) {
        // check post exist
        const postExist = await this.postRepo.getOne({ _id: params });
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        if (postExist.userId.toString() != userId.toString())
            throw new common_1.UnAuthorizedException(" you cant delete this post");
        if (postExist.attachments && postExist.attachments?.length > 0) {
            postExist.attachments?.map((obj) => {
                this.cloudProvider.deleteFile(obj.public_id);
            });
        }
        return await this.postRepo.delete({ _id: params });
    }
}
exports.default = new PostService(new post_repository_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository(), new cloudinary_service_1.CloudinaryProvider());
