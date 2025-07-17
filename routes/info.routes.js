import express from "express";
import { createInfo, getAllInfo } from "../controller/info.controller.js";

const router = express.Router();

router.get("/list", getAllInfo);
router.post("/create", createInfo);

export default router;
