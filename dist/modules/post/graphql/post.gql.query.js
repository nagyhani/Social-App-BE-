"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGQLQuery = void 0;
const post_service_1 = __importDefault(require("../post.service"));
const post_gql_type_1 = require("./post.gql.type");
exports.PostGQLQuery = {
    post: {
        type: post_gql_type_1.postGQLType,
        resolve: async () => {
            return await post_service_1.default.get("6a09d9d238c721fb1deccdd1");
        }
    }
};
