
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { postGQLType } from './post.gql.type';
import { UpdatePostDTO } from '../post.dto';

import { postRepo } from '../../../DB/models/post/post.repository';
import { IPost } from '../../../common';
import { isAuthGQL, isValidGQL } from '../../../middleware';
import { createPostSchema } from '../post.validation';

export const postMutationQL = {

    addPost :{
        type: postGQLType,

        args : {
            content: {type:GraphQLString},
            attachments : { type: new GraphQLList(GraphQLString)},
            
        },

        resolve : async (_:any,args:IPost,context:any)=>{

            isAuthGQL(context)
            isValidGQL(createPostSchema,args)

             const userId = context?.payLoad?.sub

           return await postRepo.create({...args,userId})

        }
    },

      updatePost :{
        type: postGQLType,

        args : {
            content: {type:GraphQLString},
            attachments : { type: new GraphQLList(GraphQLString)},
            postId : {type: new GraphQLNonNull(GraphQLString)}
        },

        resolve : async (_:any,args:UpdatePostDTO,context:any)=>{

             isAuthGQL(context)
            isValidGQL(createPostSchema,args)

           return await postRepo.update({_id:args.postId}, args)

        }
    }
}