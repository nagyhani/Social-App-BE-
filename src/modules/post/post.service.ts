import { Types } from "mongoose";
import { PostRepository } from "../../DB/models/post/post.repository";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { NotFoundException, ON_MODEL } from "../../common";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";

class PostService{

    constructor(private readonly postRepo: PostRepository,
       private readonly userReactionRepo : UserReactionRepository){
    }

    async create(createPost:CreatePostDTO,userId:Types.ObjectId){

      return this.postRepo.create({...createPost,userId})
    }

    async addReaction(addReactionDTO: AddReactionDTO , userId:Types.ObjectId){
          // check post exist
      const postExist =  await this.postRepo.getOne({_id : addReactionDTO.postId})
      if(!postExist) throw new NotFoundException("Post not found")

        //check user reactions
      const userReaction =  await this.userReactionRepo.getOne({onModel:ON_MODEL.Post,refId:addReactionDTO.postId,userId})

      // if no reaction
      if(!userReaction){
       await this.userReactionRepo.create({onModel:ON_MODEL.Post,refId:addReactionDTO.postId ,userId,reaction:addReactionDTO.reaction})

       await this.postRepo.update({_id:addReactionDTO.postId},{$inc:{reactionCount : 1}})

       return;
      }

      // same reaction
      if(userReaction.reaction == addReactionDTO.reaction){
        await this.postRepo.update({_id:addReactionDTO.postId},{$inc:{reactionCount : -1}})
        await this.userReactionRepo.delete({_id : userReaction._id})

        return
      }
  
      // different reaction
     await this.userReactionRepo.update({_id:userReaction._id},{reaction:addReactionDTO.reaction})
    }

    async get(params:string){
        // check post exist
      const postExist =  await this.postRepo.getOne({_id : params})
      if(!postExist) throw new NotFoundException("Post not found")

        //get post
        return postExist
    }

      async getAll(params:string){
        // check posts exist
       const postsExist =  await this.postRepo.getAll({userId:params})

       if(postsExist.length === 0) throw new NotFoundException("no posts exists")
        //get post
        return postsExist
    }

    async update(updatedPostDTO: CreatePostDTO,params:string){
        // check post exist
           const postExist =  await this.postRepo.getOne({_id : params})
         if(!postExist) throw new NotFoundException("Post not found")

        const updatedPost = await this.postRepo.update({_id:params},updatedPostDTO)

        return updatedPost


    }

    async delete(params:string){
      // check post exist
           const postExist =  await this.postRepo.getOne({_id : params})
         if(!postExist) throw new NotFoundException("Post not found")

         return await this.postRepo.delete({_id : params})
    }



    
}

export default new PostService (new PostRepository(),new UserReactionRepository())