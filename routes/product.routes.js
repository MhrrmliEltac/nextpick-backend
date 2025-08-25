import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBestSellerProduct,
  getOneProduct,
  getProductBySearchQuery,
  getProductBySubcategory,
  getProductsByCategory,
  updateProduct,
  getProductsWithFavoriteStatus,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/create", createProduct); // Məhsul yaradılması
router.get("/list", getAllProducts); // Bütün məhsullar
router.get("/list-with-favorites", getProductsWithFavoriteStatus); // Bütün məhsullar (favori statusu ilə)
router.get("/productByCategory", getProductsByCategory); // Kateqoriyaya uyğun məhsullar
router.get("/productBySubCategory", getProductBySubcategory); // Alt kateqoriyaya uyğun məhsullar
router.get("/search", getProductBySearchQuery); // Search edilerken gelen mehsullar
router.get("/best-seller", getBestSellerProduct); // Ən çox satılan məhsullar
router.get("/:id", getOneProduct); // Bir məhsul
router.put("/:id", updateProduct); // Yeniləmə
router.delete("/:id", deleteProduct); // Silmə

export default router;
