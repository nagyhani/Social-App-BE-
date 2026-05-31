import { GraphQLObjectType } from "graphql";
import { UserGQLType } from "../../user/graphQl/user.gql.type";

export const requestGQLType = new GraphQLObjectType({
    name : "requestType",
    fields : {
        user: {
            type: UserGQLType,
            resolve : (parent: any)=>{
                return parent.userId
            }
        }
    }
})