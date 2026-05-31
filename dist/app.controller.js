"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const connection_1 = require("./DB/connection");
const common_1 = require("./common");
const redis_connect_1 = require("./DB/redis.connect");
const express_2 = require("graphql-http/lib/use/express");
const graphql_1 = require("graphql");
const user_gql_query_1 = require("./modules/user/graphQl/user.gql.query");
const request_gql_query_1 = require("./modules/request/graphql/request.gql.query");
const comment_gql_query_1 = require("./modules/comment/graphql/comment.gql.query");
const story_gql_query_1 = require("./modules/story/graphql/story.gql.query");
const post_gql_query_1 = require("./modules/post/graphql/post.gql.query");
const post_gql_mutation_1 = require("./modules/post/graphql/post.gql.mutation");
const cors_1 = __importDefault(require("cors"));
function bootstrap() {
    const app = (0, express_1.default)();
    const port = 3000;
    (0, connection_1.connectDB)();
    (0, redis_connect_1.redisConnect)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({ origin: "*" }));
    const query = new graphql_1.GraphQLObjectType({
        name: "RootQuery",
        fields: {
            ...user_gql_query_1.UserGQLQuery,
            ...request_gql_query_1.RequestGQLQuery,
            ...comment_gql_query_1.CommentGQLQuery,
            ...story_gql_query_1.storyGQLQuery,
            ...post_gql_query_1.PostGQLQuery
        }
    });
    const mutation = new graphql_1.GraphQLObjectType({
        name: "RootMutation",
        fields: {
            ...post_gql_mutation_1.postMutationQL
        }
    });
    const schema = new graphql_1.GraphQLSchema({
        query,
        mutation
    });
    app.all("/graphql", (0, express_2.createHandler)({ schema,
        context: (req) => {
            const headers = req.headers;
            return { headers };
        }
    }));
    app.use("/auth", modules_1.authRouter);
    app.use("/post", modules_1.postRouter);
    app.use("/comment", modules_1.commentRouter);
    app.use("/request", modules_1.requestRouter);
    app.use("/user", modules_1.userRouter);
    app.use("/story", modules_1.storyRouter);
    app.use(common_1.errorGlobalHandler);
    const server = app.listen(port, () => {
        console.log("application running successfully on port", port);
    });
    const realTimeGateway = new common_1.RealTimeGateway(server);
    const io = realTimeGateway.io;
}
