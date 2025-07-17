import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/create", createProduct); // Məhsul yaradılması
router.get("/list", getAllProducts); // Bütün məhsullar
router.get("/:id", getOneProduct); // Bir məhsul
router.put("/:id", updateProduct); // Yeniləmə
router.delete("/:id", deleteProduct); // Silmə

export default router;
