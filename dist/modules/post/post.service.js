"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_repository_1 = require("../../DB/models/post/post.repository");
const common_1 = require("../../common");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
class PostService {
    postRepo;
    userReactionRepo;
    constructor(postRepo, userReactionRepo) {
        this.postRepo = postRepo;
        this.userReactionRepo = userReactionRepo;
    }
    async create(createPost, userId) {
        return this.postRepo.create({ ...createPost, userId });
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
    async update(updatedPostDTO, params, userId) {
        // check post exist
        const postExist = await this.postRepo.getOne({ _id: params });
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        if (postExist.userId != userId)
            throw new common_1.UnAuthorizedException(" you cant update this post");
        const updatedPost = await this.postRepo.update({ _id: params }, updatedPostDTO);
        return updatedPost;
    }
    async delete(params, userId) {
        // check post exist
        const postExist = await this.postRepo.getOne({ _id: params });
        if (!postExist)
            throw new common_1.NotFoundException("Post not found");
        if (postExist.userId != userId)
            throw new common_1.UnAuthorizedException(" you cant delete this post");
        return await this.postRepo.delete({ _id: params });
    }
}
exports.default = new PostService(new post_repository_1.PostRepository(), new user_reaction_repository_1.UserReactionRepository());
