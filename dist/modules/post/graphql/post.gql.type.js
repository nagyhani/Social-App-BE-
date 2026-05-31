"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGQLType = void 0;
const graphql_1 = require("graphql");
const comment_gql_type_1 = require("../../comment/graphql/comment.gql.type");
const user_gql_type_1 = require("../../user/graphQl/user.gql.type");
const user_model_1 = require("../../../DB/models/user/user.model");
exports.postGQLType = new graphql_1.GraphQLObjectType({
    name: "postType",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        attachments: { type: new graphql_1.GraphQLList(comment_gql_type_1.attachmentGQLType) },
        reactionCount: { type: graphql_1.GraphQLInt },
        commentCount: { type: graphql_1.GraphQLInt },
        user: {
            type: user_gql_type_1.UserGQLType,
            resolve: async (parent) => {
                return await user_model_1.User.findById(parent.userId);
            }
        }
    }
});
