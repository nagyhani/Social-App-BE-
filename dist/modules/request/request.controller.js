"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const request_service_1 = __importDefault(require("./request.service"));
const mongoose_1 = require("mongoose");
const common_1 = require("../../common");
const router = (0, express_1.Router)();
router.post("/accept/:requestId", middleware_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.acceptRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.requestId));
    return (0, common_1.successResponse)({ res, message: "request accepted " });
});
router.post("/:receiverId", middleware_1.isAuthenticated, async (req, res, next) => {
    const request = await request_service_1.default.create(req.user._id, new mongoose_1.Types.ObjectId(req.params.receiverId));
    return (0, common_1.successResponse)({ status: 201, res, message: "done", data: { request } });
});
router.delete("/decline/:requestId", middleware_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.declineRequest(req.user._id, new mongoose_1.Types.ObjectId(req.params.requestId));
    return (0, common_1.successResponse)({ res, message: "request declined" });
});
router.delete("/remove/:friendId", middleware_1.isAuthenticated, async (req, res, next) => {
    await request_service_1.default.removeFriend(req.user._id, new mongoose_1.Types.ObjectId(req.params.friendId));
    return (0, common_1.successResponse)({ res, message: "friend removed" });
});
exports.default = router;
