import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export const UserGQLType = new GraphQLObjectType({

    name:"UserType",

    fields:{
        _id: {type:GraphQLID},
        userName : {type:GraphQLString},
        password :{type:GraphQLString},
        phone : {type:GraphQLString},
        email : {type:GraphQLString},
        profilePic : {type:GraphQLString},
        gender : {type:GraphQLInt},
        role : {type: GraphQLInt},
    }
})