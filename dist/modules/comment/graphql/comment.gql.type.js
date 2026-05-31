"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentGQLType = exports.attachmentGQLType = void 0;
const graphql_1 = require("graphql");
const user_gql_type_1 = require("../../user/graphQl/user.gql.type");
const user_model_1 = require("../../../DB/models/user/user.model");
exports.attachmentGQLType = new graphql_1.GraphQLObjectType({
    name: "AttachmentType",
    fields: {
        secure_url: { type: graphql_1.GraphQLString },
        public_id: { type: graphql_1.GraphQLString },
    }
});
exports.commentGQLType = new graphql_1.GraphQLObjectType({
    name: "commentType",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        reactionCount: { type: graphql_1.GraphQLInt },
        attachment: { type: exports.attachmentGQLType },
        mentions: { type: new graphql_1.GraphQLList(user_gql_type_1.UserGQLType) },
        user: {
            type: user_gql_type_1.UserGQLType,
            resolve: async (parent) => {
                return await user_model_1.User.findById(parent.userId);
            }
        },
    }
});
