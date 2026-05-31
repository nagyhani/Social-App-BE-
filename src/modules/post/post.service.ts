import { Types } from "mongoose";
import { PostRepository } from "../../DB/models/post/post.repository";
import {CreatePostDTO } from "./post.dto";
import { NotFoundException, UnAuthorizedException } from "../../common";
import { UserReactionRepository } from "../../DB/models/user-reaction/user-reaction.repository";
import { ICloudProvider, UploadResult } from "../../common/cloud/cloud.interface";
import { CloudinaryProvider } from "../../common/cloud/cloudinary/cloudinary.service";

class PostService{

    constructor(private readonly postRepo: PostRepository,
       private readonly userReactionRepo : UserReactionRepository , private readonly cloudProvider: ICloudProvider){
    }

 async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId, files: Express.Multer.File[]) {

  const uploadedImages: UploadResult[] = []

  for (const file of files) {
    const result = await this.cloudProvider.uploadFile(file, userId)

  uploadedImages.push({
    secure_url: result.secure_url as string,
    public_id: result.public_id as string
  })
  }

  return this.postRepo.create({
    ...createPostDTO,
    attachments: uploadedImages as UploadResult[],
    userId
  })
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

    async update(updatedPostDTO: CreatePostDTO,params:string,userId:Types.ObjectId,files: Express.Multer.File[]){
        // check post exist
           const postExist =  await this.postRepo.getOne({_id : params})
           
         if(!postExist) throw new NotFoundException("Post not found")
          if(postExist.userId.toString() != userId.toString()) throw new UnAuthorizedException(" you can't update this post")

            const uploadedImages: UploadResult[] = []
          

  for (const file of files) {
    const result = await this.cloudProvider.uploadFile(file, userId)

  uploadedImages.push({
    secure_url: result.secure_url as string,
    public_id: result.public_id as string
  })
  }

    updatedPostDTO.attachments = uploadedImages as UploadResult[]

 
        const updatedPost = await this.postRepo.update({_id:params},updatedPostDTO)

        return updatedPost


    }

    async delete(params:string,userId:Types.ObjectId){
      // check post exist
           const postExist =  await this.postRepo.getOne({_id : params})
         if(!postExist) throw new NotFoundException("Post not found")
      
         if(postExist.userId.toString() != userId.toString()) throw new UnAuthorizedException(" you cant delete this post")

          if(postExist.attachments && postExist.attachments?.length > 0){

            postExist.attachments?.map((obj)=>{
              this.cloudProvider.deleteFile(obj.public_id as string)
            })
          }

         return await this.postRepo.delete({_id : params})
    }



    
}

export default new PostService (new PostRepository(),new UserReactionRepository(), new CloudinaryProvider())