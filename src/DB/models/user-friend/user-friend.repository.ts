import { IUserFriend } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { UserFriend } from "./user-friend.model";

export class UserFriendRepo extends AbstractRepository<IUserFriend>{

    constructor(){
        super(UserFriend)
    }
}


export const userFriendRepo = new UserFriendRepo()