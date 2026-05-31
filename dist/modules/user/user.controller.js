"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const user_service_1 = __importDefault(require("./user.service"));
const common_1 = require("../../common");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/", middleware_1.isAuthenticated, async (req, res, next) => {
    const { friends, user } = await user_service_1.default.get(req.user._id);
    return (0, common_1.successResponse)({ res, message: "done", data: { user, friends } });
});
router.get("/feed", middleware_1.isAuthenticated, async (req, res, next) => {
    const data = await user_service_1.default.feed(req.user._id);
    return (0, common_1.successResponse)({ res, message: "done", data: { data } });
});
router.get("/dash-board", middleware_1.isAuthenticated, async (req, res, next) => {
    const data = await user_service_1.default.dashboard(req.user._id);
    return (0, common_1.successResponse)({ res, message: "done", data: { data } });
});
router.patch("/", middleware_1.isAuthenticated, (0, middleware_1.isValid)(user_validation_1.updateUserSchema), async (req, res, next) => {
    const updatedUser = await user_service_1.default.update(req.body, req.user._id, req.payload);
    return (0, common_1.successResponse)({ res, status: 201, message: "done", data: { updatedUser } });
});
router.delete("/", middleware_1.isAuthenticated, async (req, res, next) => {
    await user_service_1.default.delete(req.user._id);
    return (0, common_1.successResponse)({ res, message: "done" });
});
exports.default = router;
