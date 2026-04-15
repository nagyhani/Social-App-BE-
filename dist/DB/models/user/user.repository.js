"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const abstratct_repository_1 = require("../../abstratct.repository");
const user_model_1 = require("./user.model");
class UserRepository extends abstratct_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
}
exports.UserRepository = UserRepository;
