import { Router } from "express";
import { protect } from "../middleware/protectToken.js";
import {
  forgotPassword,
  profile,
  resetPassword,
  sendOTP,
  signIn,
  signOut,
  signUp,
  verifyOTP,
  verifyOTPForForgotPassword,
} from "../controller/users.controller.js";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

const router = Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", apiKeyMiddleware, signIn);
router.post("/register", apiKeyMiddleware, signUp);
router.post("/sign-out", signOut);
router.post("/forgot-password", apiKeyMiddleware, forgotPassword);
router.post(
  "/verify-otp-forgot-password",
  apiKeyMiddleware,
  verifyOTPForForgotPassword
);
router.post("/reset-password", apiKeyMiddleware, resetPassword);
router.get("/profile", protect, apiKeyMiddleware, profile);

export default router;
