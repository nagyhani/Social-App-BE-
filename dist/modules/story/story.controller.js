"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const story_validation_1 = require("./story.validation");
const story_service_1 = require("./story.service");
const common_1 = require("../../common");
const post_validation_1 = require("../post/post.validation");
const story_repository_1 = require("../../DB/models/story/story.repository");
const multer_utils_1 = require("../../common/utils/multer.utils");
const router = (0, express_1.Router)();
router.post("/", middleware_1.isAuthenticated, (0, multer_utils_1.multerUploadFile)().single("attachment"), (0, middleware_1.isValid)(story_validation_1.createStorySchema), async (req, res, next) => {
    const hasFile = !!req.file || (req.files && req.files.length > 0);
    const hasContent = !!req.body.content;
    if (!hasFile && !hasContent) {
        throw new common_1.BadRequestException("content or attachment is required");
    }
    const createdStory = await story_service_1.storyService.create(req.body, req.user._id, req.file);
    return (0, common_1.successResponse)({ res, status: 201, message: "done", data: { createdStory } });
});
router.post("/add-reaction", middleware_1.isAuthenticated, (0, middleware_1.isValid)(post_validation_1.addReactionSchema), async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, req.user._id, story_repository_1.storyRepo);
    return (0, common_1.successResponse)({ res, status: 201, message: "done" });
});
router.get("/:id", middleware_1.isAuthenticated, async (req, res, next) => {
    const story = await story_service_1.storyService.get(req.params.id, req.user._id);
    return (0, common_1.successResponse)({ res, message: "done", data: { story } });
});
router.patch("/:id", middleware_1.isAuthenticated, (0, multer_utils_1.multerUploadFile)().single("attachment"), (0, middleware_1.isValid)(story_validation_1.createStorySchema), async (req, res, next) => {
    const hasFile = !!req.file || (req.files && req.files.length > 0);
    const hasContent = !!req.body.content;
    if (!hasFile && !hasContent) {
        throw new common_1.BadRequestException("content or attachment is required");
    }
    const updatedStory = await story_service_1.storyService.update(req.params.id, req.user._id, req.body, req.file);
    return (0, common_1.successResponse)({ res, message: "done", data: { updatedStory } });
});
router.delete("/:id", middleware_1.isAuthenticated, async (req, res, next) => {
    await story_service_1.storyService.delete(req.params.id, req.user._id);
    return (0, common_1.successResponse)({ res, message: "done" });
});
exports.default = router;
