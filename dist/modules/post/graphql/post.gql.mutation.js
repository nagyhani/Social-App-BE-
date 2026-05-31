"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMutationQL = void 0;
const graphql_1 = require("graphql");
const post_gql_type_1 = require("./post.gql.type");
const post_repository_1 = require("../../../DB/models/post/post.repository");
const middleware_1 = require("../../../middleware");
const post_validation_1 = require("../post.validation");
exports.postMutationQL = {
    addPost: {
        type: post_gql_type_1.postGQLType,
        args: {
            content: { type: graphql_1.GraphQLString },
            attachments: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        },
        resolve: async (_, args, context) => {
            (0, middleware_1.isAuthGQL)(context);
            (0, middleware_1.isValidGQL)(post_validation_1.createPostSchema, args);
            const userId = context?.payLoad?.sub;
            return await post_repository_1.postRepo.create({ ...args, userId });
        }
    },
    updatePost: {
        type: post_gql_type_1.postGQLType,
        args: {
            content: { type: graphql_1.GraphQLString },
            attachments: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
            postId: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
        },
        resolve: async (_, args, context) => {
            (0, middleware_1.isAuthGQL)(context);
            (0, middleware_1.isValidGQL)(post_validation_1.createPostSchema, args);
            return await post_repository_1.postRepo.update({ _id: args.postId }, args);
        }
    }
};
