"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const comment_service_1 = __importDefault(require("../comment.service"));
const comment_gql_type_1 = require("./comment.gql.type");
exports.CommentGQLQuery = {
    comment: {
        type: comment_gql_type_1.commentGQLType,
        resolve: async () => {
            return await comment_service_1.default.get(new mongoose_1.Types.ObjectId("6a09d9ea38c721fb1deccdd5"));
        }
    }
};
