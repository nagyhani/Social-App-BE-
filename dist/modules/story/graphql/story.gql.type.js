"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyGQLType = void 0;
const graphql_1 = require("graphql");
const comment_gql_type_1 = require("../../comment/graphql/comment.gql.type");
const user_gql_type_1 = require("../../user/graphQl/user.gql.type");
const user_model_1 = require("../../../DB/models/user/user.model");
exports.storyGQLType = new graphql_1.GraphQLObjectType({
    name: "storyType",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        attachment: { type: comment_gql_type_1.attachmentGQLType },
        content: { type: graphql_1.GraphQLString },
        reactionCount: { type: graphql_1.GraphQLInt },
        user: {
            type: user_gql_type_1.UserGQLType,
            resolve: async (parent) => {
                return await user_model_1.User.findById(parent.userId);
            }
        }
    }
});
