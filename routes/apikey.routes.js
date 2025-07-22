import express from "express";
import { createApiKey } from "../controller/apikey.controller.js";

const router = express.Router();

router.post("/create", createApiKey);

export default router;
