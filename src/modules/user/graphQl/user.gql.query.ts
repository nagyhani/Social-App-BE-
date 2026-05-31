import { Types } from "mongoose";
import userService from "../user.service";
import { UserGQLType } from "./user.gql.type";

export const UserGQLQuery = {

    user:{
        type: UserGQLType,

        resolve : async ()=>{
        
            
          return await userService.get( new Types.ObjectId("69fcc25331d1c8a47b4633ff"))
        }
    }
}