import postService from "../post.service";
import { postGQLType } from "./post.gql.type";

export const PostGQLQuery = {

    post : {
        type: postGQLType,

        resolve: async ()=>{
            return await postService.get("6a09d9d238c721fb1deccdd1")
        }
    }
}