import { Types } from "mongoose";
import { storyService } from "../story.service";
import { storyGQLType } from "./story.gql.type";

export const storyGQLQuery = {

    story:{
        type : storyGQLType,

        resolve : async ()=>{

        return await storyService.get("6a0a5274a7872661603dc59d",new Types.ObjectId("69fcc25331d1c8a47b4633ff"))

        }
    }
}