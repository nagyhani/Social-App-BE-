"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestGQLType = void 0;
const graphql_1 = require("graphql");
const user_gql_type_1 = require("../../user/graphQl/user.gql.type");
exports.requestGQLType = new graphql_1.GraphQLObjectType({
    name: "requestType",
    fields: {
        user: {
            type: user_gql_type_1.UserGQLType,
            resolve: (parent) => {
                return parent.userId;
            }
        }
    }
});
