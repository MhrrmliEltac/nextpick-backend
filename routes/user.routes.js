import { Router } from "express";
import { protect } from "../middleware/protectToken.js";
import {
  profile,
  sendOTP,
  signIn,
  signUp,
  verifyOTP,
} from "../controller/users.controller.js";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";

const router = Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", apiKeyMiddleware, signIn);
router.post("/register", apiKeyMiddleware, signUp);
router.get("/profile", protect, apiKeyMiddleware, profile);

export default router;
