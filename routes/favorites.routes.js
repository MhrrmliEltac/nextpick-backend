import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
} from "../controller/favorites.controller.js";
import { protect } from "../middleware/protectToken.js";

const router = express.Router();

// All favorites routes require authentication via cookie token
router.use(protect);

// Add product to favorites (requires valid cookie token)
router.post("/add", addToFavorites);

// Remove product from favorites (requires valid cookie token)
router.delete("/remove/:productId", removeFromFavorites);

// Get user's favorites (requires valid cookie token)
router.get("/my-favorites", getUserFavorites);

// Check if product is in user's favorites (requires valid cookie token)
router.get("/check/:productId", checkFavoriteStatus);

export default router;
