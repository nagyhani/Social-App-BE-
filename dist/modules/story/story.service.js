"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyService = void 0;
const mongoose_1 = require("mongoose");
const story_repository_1 = require("../../DB/models/story/story.repository");
const common_1 = require("../../common");
const cloudinary_service_1 = require("../../common/cloud/cloudinary/cloudinary.service");
class StoryService {
    storyRepo;
    cloudProvider;
    constructor(storyRepo, cloudProvider) {
        this.storyRepo = storyRepo;
        this.cloudProvider = cloudProvider;
    }
    async create(createStoryDTO, userId, file) {
        let attachmentFile = null;
        if (file) {
            attachmentFile = await this.cloudProvider.uploadFile(file, userId);
        }
        return await this.storyRepo.create({ ...createStoryDTO, userId, attachment: { public_id: attachmentFile?.public_id, secure_url: attachmentFile?.secure_url } });
    }
    async get(id, userId) {
        const story = await this.storyRepo.getOne({ _id: new mongoose_1.Types.ObjectId(id), userId });
        if (!story)
            throw new common_1.NotFoundException("story not found");
        return story;
    }
    async update(id, userId, createStoryDTO, file) {
        let attachmentFile = null;
        if (file) {
            attachmentFile = await this.cloudProvider.uploadFile(file, userId);
        }
        const story = await this.storyRepo.update({ _id: new mongoose_1.Types.ObjectId(id), userId }, { ...createStoryDTO, attachment: { public_id: attachmentFile?.public_id, secure_url: attachmentFile?.secure_url } });
        if (!story)
            throw new common_1.NotFoundException("story not found");
        return story;
    }
    async delete(id, userId) {
        const story = await this.storyRepo.getOne({ _id: new mongoose_1.Types.ObjectId(id), userId });
        if (!story)
            throw new common_1.NotFoundException("story not found");
        if (story.attachment?.public_id)
            await this.cloudProvider.deleteFile(story.attachment?.public_id);
        await this.storyRepo.delete({ _id: new mongoose_1.Types.ObjectId(id), userId });
    }
}
exports.storyService = new StoryService(new story_repository_1.StoryRepository(), new cloudinary_service_1.CloudinaryProvider());
