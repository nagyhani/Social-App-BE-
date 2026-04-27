import { Types } from "mongoose";
import { CreateCommentDTO } from "./comment.dto";
import { PostRepository } from "../../DB/models/post/post.repository";
import { NotFoundException } from "../../common";
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
}

export default new CommentService(new PostRepository(),new CommentRepository())