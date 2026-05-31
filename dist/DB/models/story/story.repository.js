"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyRepo = exports.StoryRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const story_model_1 = require("./story.model");
class StoryRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(story_model_1.Story);
    }
}
exports.StoryRepository = StoryRepository;
exports.storyRepo = new StoryRepository();
