import { Router } from "express";
import { protect } from "../middleware/protectToken.js";
import { profile, signIn, signUp } from "../controller/users.controller.js";

const router = Router();

router.post("/login", signIn);
router.post("/register", signUp);
router.get("/profile", protect, profile);

export default router;
