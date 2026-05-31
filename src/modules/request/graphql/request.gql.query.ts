import { Types } from "mongoose";
import requestService from "../request.service";
import { requestGQLType } from "./request.gql.type";

export const RequestGQLQuery = {

    request:{

          type : requestGQLType,

    resolve:async ()=>{
      return await requestService.getAll( new Types.ObjectId(""))
    }

    }

  
}