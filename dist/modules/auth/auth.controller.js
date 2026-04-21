"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../../middleware");
const auth_validation_1 = require("./auth.validation");
const auth_service_1 = require("./auth.service");
const common_1 = require("../../common");
const router = (0, express_1.Router)();
router.post("/signup", (0, middleware_1.isValid)(auth_validation_1.signUpSchema), async (req, res, next) => {
    await auth_service_1.authService.signUp(req.body);
    return (0, common_1.successResponse)({ res, status: 201, message: "done" });
});
router.post("/login", (0, middleware_1.isValid)(auth_validation_1.loginSchema), async (req, res, next) => {
    const { accessToken, refreshToken } = await auth_service_1.authService.login(req.body);
    return (0, common_1.successResponse)({ res, message: "done", data: { accessToken, refreshToken } });
});
router.post("/verify-account", (0, middleware_1.isValid)(auth_validation_1.verifySchema), async (req, res, next) => {
    await auth_service_1.authService.verifyAccount(req.body);
    return (0, common_1.successResponse)({ res, status: 201, message: "user created successfully" });
});
router.post("/send-otp", (0, middleware_1.isValid)(auth_validation_1.sendOtpSchema), async (req, res, next) => {
    await auth_service_1.authService.sendOtp(req.body.email);
    return (0, common_1.successResponse)({ res, message: "otp sent successfully" });
});
router.patch("/reset-password", middleware_1.isAuthenticated, (0, middleware_1.isValid)(auth_validation_1.resetPasswordSchema), async (req, res, next) => {
    await auth_service_1.authService.resetPassword(req.body);
    return (0, common_1.successResponse)({ res, message: "password updated successfully" });
});
router.patch("/change-password", middleware_1.isAuthenticated, (0, middleware_1.isValid)(auth_validation_1.changePasswordSchema), async (req, res, next) => {
    await auth_service_1.authService.changePassword(req.body, req.user._id);
    return (0, common_1.successResponse)({ res, message: "password changed successfully" });
});
exports.default = router;
