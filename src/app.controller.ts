import express from "express"
import { authRouter, commentRouter, postRouter } from "./modules";
import { connectDB } from "./DB/connection";
import { errorGlobalHandler } from "./common";
import { redisConnect } from "./DB/redis.connect";

export function bootstrap(){
    const app = express()
    const port = 3000
   
    connectDB()
    redisConnect()
      app.use(express.json())

    app.use("/auth" , authRouter)
    app.use("/post",postRouter)
    app.use("/comment",commentRouter)

    app.use(errorGlobalHandler)

    app.listen(port,()=>{
        console.log("application running successfully on port" ,port);
        
    })
    

}