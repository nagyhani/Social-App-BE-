import { Server, Socket } from "socket.io";
import {Server as HttpServer} from "node:http"
import { verifyToken } from "../utils";
import { ACCESS_TOKEN_SECRET } from "../../config";
import { addToSet, getAllSet, rmSet } from "../../DB";




export class RealTimeGateway {

    private readonly _io: Server
    

    constructor(server:HttpServer){
        this._io = new Server(server,{cors: {origin:"*"}})
    }

    public establishConnection(){

        this._io.use((socket:Socket,next:any)=>{
            try {

                socket.data = verifyToken(socket.handshake.auth.token,ACCESS_TOKEN_SECRET)
                next()
                
            } catch (error) {
                next(error)
            }
        })

        this._io.on("connection", async (socket:Socket)=>{

            await addToSet(`socketIds:${socket.data.sub}`,socket.id)
            const socketIds = await getAllSet(`socketIds:${socket.data.sub}`)


            console.log(socketIds);

            socket.on("disconnect", async()=>{
                await rmSet(`socketIds:${socket.data.sub}`,socket.id)

                console.log("disconnects" , socket.id);
                
            })

        })
    }


    public get io(){

        this.establishConnection()


        return this._io
    }


}