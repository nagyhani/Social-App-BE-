"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const common_1 = require("../../common");
const post_validation_1 = require("./post.validation");
const post_service_1 = __importDefault(require("./post.service"));
const post_repository_1 = require("../../DB/models/post/post.repository");
const router = (0, express_1.Router)();
router.post("/", middleware_1.isAuthenticated, (0, middleware_1.isValid)(post_validation_1.createPostSchema), async (req, res, next) => {
    const post = await post_service_1.default.create(req.body, req.user._id);
    return (0, common_1.successResponse)({ res, status: 201, message: "post created successfully", data: post });
});
router.post("/add-reaction", middleware_1.isAuthenticated, (0, middleware_1.isValid)(post_validation_1.addReactionSchema), async (req, res, next) => {
    await (0, common_1.addReaction)(req.body, req.user._id, post_repository_1.postRepo);
    return (0, common_1.successResponse)({ res, message: "done" });
});
router.get("/posts/:userId", middleware_1.isAuthenticated, async (req, res, next) => {
    const posts = await post_service_1.default.getAll(req.params.userId);
    return (0, common_1.successResponse)({ res, message: "done", data: posts });
});
router.get("/:postId", middleware_1.isAuthenticated, async (req, res, next) => {
    const post = await post_service_1.default.get(req.params.postId);
    return (0, common_1.successResponse)({ res, message: "done", data: post });
});
router.patch("/:postId", middleware_1.isAuthenticated, (0, middleware_1.isValid)(post_validation_1.createPostSchema), async (req, res, next) => {
    const post = await post_service_1.default.update(req.body, req.params.postId);
    return (0, common_1.successResponse)({ res, message: "done", data: post });
});
router.delete("/:postId", middleware_1.isAuthenticated, async (req, res, next) => {
    await post_service_1.default.delete(req.params.postId);
    const post = await post_service_1.default.update(req.body, req.params.postId);
    return (0, common_1.successResponse)({ res, message: "Post deleted" });
});
exports.default = router;
