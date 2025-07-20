import express from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategory,
} from "../controller/subcategory.controller.js";

const router = express.Router();

router.post("/create", createSubCategory);
router.get("/list", getAllSubCategories);
router.get("/subcategories", getSubCategoriesByCategory);
router.get("/:id", getSubCategoryById);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
