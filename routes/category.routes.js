import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
} from "../controller/category.controller.js";

const router = express.Router();

router.post("/create", createCategory);
router.get("/list", getAllCategory);
router.get("/:id", getOneCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
