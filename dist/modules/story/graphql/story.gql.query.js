"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyGQLQuery = void 0;
const mongoose_1 = require("mongoose");
const story_service_1 = require("../story.service");
const story_gql_type_1 = require("./story.gql.type");
exports.storyGQLQuery = {
    story: {
        type: story_gql_type_1.storyGQLType,
        resolve: async () => {
            return await story_service_1.storyService.get("6a0a5274a7872661603dc59d", new mongoose_1.Types.ObjectId("69fcc25331d1c8a47b4633ff"));
        }
    }
};
