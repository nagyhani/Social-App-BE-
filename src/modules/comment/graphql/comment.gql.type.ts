import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UserGQLType } from "../../user/graphQl/user.gql.type";
import { User } from "../../../DB/models/user/user.model";



export const attachmentGQLType = new GraphQLObjectType({
  name: "AttachmentType",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  }
});



export const commentGQLType = new GraphQLObjectType({
    name:"commentType",
    fields: {
        _id:{type:GraphQLID},
        content: {type:GraphQLString},
        reactionCount :{type:GraphQLInt},
        attachment: {type: attachmentGQLType},
        mentions: {type: new GraphQLList(UserGQLType)},
        user: {
            type : UserGQLType,
            resolve : async(parent:any)=>{

               return await User.findById(parent.userId);
            }
        },

      
    }
})