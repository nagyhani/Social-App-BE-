"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const request_service_1 = __importDefault(require("../request.service"));
const request_gql_type_1 = require("./request.gql.type");
exports.RequestGQLQuery = {
    request: {
        type: request_gql_type_1.requestGQLType,
        resolve: async () => {
            return await request_service_1.default.getAll(new mongoose_1.Types.ObjectId(""));
        }
    }
};
