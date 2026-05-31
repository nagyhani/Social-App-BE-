import { IRequest } from "../../../common/interFaces/request.interface";
import { AbstractRepository } from "../../abstract.repository";
import { Request} from "./request.model";


export class RequestRepo extends AbstractRepository<IRequest> {

    constructor(){
        super(Request)
    }
 }


 export const requestRepo = new RequestRepo()