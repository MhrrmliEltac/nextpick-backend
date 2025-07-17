import express from "express";
import { createBrands, getAllBrands } from "../controller/brand.controller.js";

const router = express.Router();

router.post("/create", createBrands);
router.get("/list", getAllBrands);

export default router;
