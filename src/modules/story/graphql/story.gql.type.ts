import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { attachmentGQLType } from "../../comment/graphql/comment.gql.type";
import { UserGQLType } from "../../user/graphQl/user.gql.type";
import { User } from "../../../DB/models/user/user.model";

export const storyGQLType = new GraphQLObjectType({
    name:"storyType",

    fields : {
        _id :{type:GraphQLID},
        attachment : {type: attachmentGQLType},
        content : {type:GraphQLString},
        reactionCount : {type:GraphQLInt},
          user: {
                    type : UserGQLType,
                    resolve : async(parent:any)=>{
        
                       return await User.findById(parent.userId);
                    }
                }
    }
})