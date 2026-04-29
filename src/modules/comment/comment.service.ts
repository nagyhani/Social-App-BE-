import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { IPost, NotFoundException, UnAuthorizedException } from "../../common";
import { CommentRepository } from "../../DB/models/comment/comment.repository";


class CommentService {

    constructor(private readonly postRepo:PostRepository,private readonly commentRepo: CommentRepository){}

    async create(createCommentDTO:CreateCommentDTO,params:any,userId:Types.ObjectId){

        //check post exist 
        const postExist = await this.postRepo.getOne({_id:params.postId})

        if(!postExist) throw new NotFoundException("Post not found")

        if(params.parentId){

            const parentComment = await this.commentRepo.getOne({_id:params.parentId})

             if(!parentComment) throw new NotFoundException("Comment not found")
        }

        //create comment
        await this.postRepo.update({_id:params.postId},{$inc:{commentCount : 1}})

        return await this.commentRepo.create({...createCommentDTO,...params,userId})
    }

    async getAll(params:any){
        const comments = await this.commentRepo.getAll({postId:params.postId,parentId:params.parentId})

        if(comments.length == 0)throw new NotFoundException("No comments")

            return comments
    }

  async delete(id: Types.ObjectId, userId: Types.ObjectId) {
 

  const commentExist = await this.commentRepo.getOne({_id:id},{},{populate:["postId"]});
  
  if (!commentExist) throw new NotFoundException("comment not found!");

  const commentAuthor = commentExist.userId.toString();
  

  const postAuthor = (commentExist.postId as any)?.userId?.toString();
  

  if (userId.toString() != commentAuthor && userId.toString() != postAuthor) {
    throw new UnAuthorizedException("you are not allowed");
  }

  
 return await this.commentRepo.delete({_id:id});
}
}

export default new CommentService(new PostRepository(),new CommentRepository())