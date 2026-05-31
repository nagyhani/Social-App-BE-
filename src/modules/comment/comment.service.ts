import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { NotFoundException, UnAuthorizedException } from "../../common";
import { CommentRepository } from "../../DB/models/comment/comment.repository";
import { FireBaseNotificationProvider } from "../../common/notification/fireBase/fireBase.service";
import { getAllSet } from "../../DB";
import { fireBaseNotificationProvider } from "../../common/notification/fireBase/fireBase.intit";
import { ICloudProvider, UploadResult } from "../../common/cloud/cloud.interface";
import { CloudinaryProvider } from "../../common/cloud/cloudinary/cloudinary.service";


class CommentService {

    constructor(private readonly postRepo:PostRepository,private readonly commentRepo: CommentRepository,private readonly fireBaseNotifcationProvider: FireBaseNotificationProvider, private readonly cloudProvider : ICloudProvider){}

    async create(createCommentDTO:CreateCommentDTO,params:any,userId:Types.ObjectId,file: Express.Multer.File){

        //check post exist 
        const postExist = await this.postRepo.getOne({_id:params.postId})

        if(!postExist) throw new NotFoundException("Post not found")

        if(params.parentId){

            const parentComment = await this.commentRepo.getOne({_id:params.parentId})

             if(!parentComment) throw new NotFoundException("Comment not found")
        }

        const fcmTokens = await getAllSet(`${postExist.userId.toString()}:FCM`) 

        await this.fireBaseNotifcationProvider.sendAll(fcmTokens , {title: "New comment",body:`${userId} commented on your post`})

let attachmentFile: UploadResult | null = null

  if (file) {
     attachmentFile = await this.cloudProvider.uploadFile(file, userId)
  }

    attachmentFile
        //create comment
        await this.postRepo.update({_id:params.postId},{$inc:{commentCount : 1}})

        return await this.commentRepo.create({...createCommentDTO,...params,userId,attachment:{public_id:attachmentFile?.public_id,secure_url:attachmentFile?.secure_url}})
    }

    async get(id:Types.ObjectId){
      return await this.commentRepo.getOne({_id : id})
    }

    async getAll(params:any){
        const comments = await this.commentRepo.getAll({postId:params.postId,parentId:params.parentId})

        if(comments.length == 0)throw new NotFoundException("No comments")

            return comments
    }


    async update(updateCommentDTO:CreateCommentDTO,userId:Types.ObjectId,id:string,file: Express.Multer.File){

        const commentExist = await this.commentRepo.getOne({_id: new Types.ObjectId(id),userId})

        if(!commentExist) throw new NotFoundException("comment not found")

          let attachmentFile: UploadResult | null = null

  if (file) {
     attachmentFile = await this.cloudProvider.uploadFile(file, userId)
  }
        return await this.commentRepo.update({_id:id},{...updateCommentDTO,attachment:{public_id:attachmentFile?.public_id,secure_url:attachmentFile?.secure_url}})

    }

  async delete(id: Types.ObjectId, userId: Types.ObjectId) {
 

  const commentExist = await this.commentRepo.getOne({_id:id},{},{populate:["postId"]});
  
  if (!commentExist) throw new NotFoundException("comment not found!");

  const commentAuthor = commentExist.userId.toString();
  

  const postAuthor = (commentExist.postId as any)?.userId?.toString();
  

  if (userId.toString() != commentAuthor && userId.toString() != postAuthor) {
    throw new UnAuthorizedException("you are not allowed");
  }

  if(commentExist.attachment?.public_id) await this.cloudProvider.deleteFile(commentExist.attachment?.public_id as string)



  

 return await this.commentRepo.delete({_id:id});
}
}

export default new CommentService(new PostRepository(),new CommentRepository(), fireBaseNotificationProvider , new CloudinaryProvider())