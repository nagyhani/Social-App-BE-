import express, { Request } from "express"
import { authRouter, commentRouter, postRouter, requestRouter, storyRouter, userRouter } from "./modules";
import { connectDB } from "./DB/connection";
import { errorGlobalHandler, RealTimeGateway } from "./common";
import { redisConnect } from "./DB/redis.connect";
import { createHandler } from "graphql-http/lib/use/express";
import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { UserGQLQuery } from "./modules/user/graphQl/user.gql.query";
import { RequestGQLQuery } from "./modules/request/graphql/request.gql.query";
import { CommentGQLQuery } from "./modules/comment/graphql/comment.gql.query";
import { storyGQLQuery } from "./modules/story/graphql/story.gql.query";
import { PostGQLQuery } from "./modules/post/graphql/post.gql.query";
import { postMutationQL } from "./modules/post/graphql/post.gql.mutation";
import cors from "cors"

export function bootstrap(){
    const app = express()
    const port = 3000
   
    connectDB()
    redisConnect()
    app.use(express.json())
    app.use(cors({origin:"*"}))

    const query = new GraphQLObjectType({
        name: "RootQuery" ,
        fields: {

            ...UserGQLQuery,
            ...RequestGQLQuery,
            ...CommentGQLQuery,
            ...storyGQLQuery,
            ...PostGQLQuery

        } 
    })

    const mutation = new GraphQLObjectType({
        name: "RootMutation",

        fields : {
            ...postMutationQL
        }
    })

    const schema = new GraphQLSchema({
        query,
        mutation
    })

    app.all("/graphql", createHandler({schema,
        context : (req)=>{

            const headers = req.headers
            return {headers}
        }
    }))

    app.use("/auth" , authRouter)
    app.use("/post",postRouter)
    app.use("/comment",commentRouter)
    app.use("/request",requestRouter)
    app.use("/user",userRouter)
    app.use("/story",storyRouter)

    app.use(errorGlobalHandler)

   const server = app.listen(port,()=>{
        console.log("application running successfully on port" ,port);
    })

    const realTimeGateway = new RealTimeGateway(server)

   const io =  realTimeGateway.io
    


}