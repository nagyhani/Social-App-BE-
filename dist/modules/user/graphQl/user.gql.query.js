"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const user_service_1 = __importDefault(require("../user.service"));
const user_gql_type_1 = require("./user.gql.type");
exports.UserGQLQuery = {
    user: {
        type: user_gql_type_1.UserGQLType,
        resolve: async () => {
            return await user_service_1.default.get(new mongoose_1.Types.ObjectId("69fcc25331d1c8a47b4633ff"));
        }
    }
};
