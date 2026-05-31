"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFriendRepo = exports.UserFriendRepo = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const user_friend_model_1 = require("./user-friend.model");
class UserFriendRepo extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_friend_model_1.UserFriend);
    }
}
exports.UserFriendRepo = UserFriendRepo;
exports.userFriendRepo = new UserFriendRepo();
