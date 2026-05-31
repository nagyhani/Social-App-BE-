import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { attachmentGQLType } from "../../comment/graphql/comment.gql.type";
import { UserGQLType } from "../../user/graphQl/user.gql.type";
import { User } from "../../../DB/models/user/user.model";


export const postGQLType = new GraphQLObjectType({
    name:"postType",
    fields :{
        _id: {type:GraphQLID},
        content : {type: GraphQLString},
        attachments: {type: new GraphQLList(attachmentGQLType)},
        reactionCount: {type: GraphQLInt},
        commentCount: {type: GraphQLInt},
          user: {
                    type : UserGQLType,
                    resolve : async(parent:any)=>{
        
                       return await User.findById(parent.userId);
                    }
                }

    }
})