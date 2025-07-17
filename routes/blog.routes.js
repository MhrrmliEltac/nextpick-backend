import express from "express";
import { createBlog, getAllBlog } from "../controller/blog.controller.js";

const router = express.Router();

router.get("/list", getAllBlog);
router.post("/create", createBlog);

export default router;
