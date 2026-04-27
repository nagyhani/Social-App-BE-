"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const comment_service_1 = __importDefault(require("./comment.service"));
const common_1 = require("../../common");
const post_validation_1 = require("../post/post.validation");
const comment_repository_1 = require("../../DB/models/comment/comment.repository");
const router = (0, express_1.Router)();
router.post("/add-reaction", middleware_1.isAuthenticated, (0, middleware_1.isValid)(post_validation_1.addReactionSchema), async (req, res, next) => {
    console.log(req.user._id);
    await (0, common_1.addReaction)(req.body, req.user._id, comment_repository_1.commentRepo);
    return (0, common_1.successResponse)({ res, message: "done" });
});
router.get("/:postId{/:parentId}", middleware_1.isAuthenticated, async (req, res, next) => {
    const comments = await comment_service_1.default.getAll(req.params);
    return (0, common_1.successResponse)({ res, message: "done", data: { comments } });
});
router.post("/:postId{/:parentId}", middleware_1.isAuthenticated, async (req, res, next) => {
    const createdComment = await comment_service_1.default.create(req.body, req.params, req.user._id);
    return (0, common_1.successResponse)({ res, status: 201, message: "Comment created", data: { createdComment } });
});
exports.default = router;
