import express from "express";
import {
  createSubCategory,
  bulkCreateSubCategories,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategory,
} from "../controller/subcategory.controller.js";

const router = express.Router();

router.post("/create", createSubCategory);
router.post("/bulk-create", bulkCreateSubCategories);
router.get("/list", getAllSubCategories);
router.get("/subcategories", getSubCategoriesByCategory);
router.get("/:id", getSubCategoryById);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
