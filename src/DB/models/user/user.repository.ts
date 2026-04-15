import { IUser } from "../../../common";
import { AbstractRepository } from "../../abstratct.repository";
import { User } from "./user.model";

export class UserRepository extends AbstractRepository<IUser>{
    constructor(){
        super(User)
    }
}