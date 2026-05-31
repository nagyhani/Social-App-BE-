import { Types } from "mongoose";
import commentService from "../comment.service";
import { commentGQLType } from "./comment.gql.type";

export const CommentGQLQuery = {

    comment :{
        type: commentGQLType,

        resolve : async ()=>{

            return await commentService.get(new Types.ObjectId("6a09d9ea38c721fb1deccdd5"))
        }
    }
}