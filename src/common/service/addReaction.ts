import { Types } from "mongoose"
import { AddReactionDTO } from "../dto"
import { PostRepository } from "../../DB/models/post/post.repository"
import { CommentRepository } from "../../DB/models/comment/comment.repository"
import { BadRequestException, NotFoundException } from "../utils"
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository"
import { ON_MODEL } from "../enums"


function toModel(collectionName:string){

    switch (collectionName) {
        case "posts":
            return ON_MODEL.Post
            

        case "comments":
            return ON_MODEL.Comment
          
    
        default:
           throw new BadRequestException("invalid collection")
    }
}


export const addReaction = async (addReactionDTO: AddReactionDTO , userId:Types.ObjectId, repo: PostRepository | CommentRepository )=>{
     
          // check post exist
        
      const docExist =  await repo.getOne({_id : addReactionDTO.id})

      if(!docExist) throw new NotFoundException("not found")

        //check user reactions
        const userReactionRepo = new UserReactionRepository()
      const collectionName = docExist?.collection.name
      const userReaction =  await userReactionRepo.getOne({onModel:toModel(collectionName as string),refId:addReactionDTO.id,userId})

      // if no reaction
      if(!userReaction){
       await userReactionRepo.create({onModel:toModel(collectionName as string),refId:addReactionDTO.id ,userId,reaction:addReactionDTO.reaction})

       await repo.update({_id:addReactionDTO.id},{$inc:{reactionCount : 1}})

       return;
      }

      // same reaction
      if(userReaction.reaction == addReactionDTO.reaction){
        await repo.update({_id:addReactionDTO.id},{$inc:{reactionCount : -1}})
        await userReactionRepo.delete({_id : userReaction._id})

        return
      }
  
      // different reaction
     await userReactionRepo.update({_id:userReaction._id},{reaction:addReactionDTO.reaction})
    }