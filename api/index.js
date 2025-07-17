import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

// import routes
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import infoRoutes from "./routes/info.routes.js";

dotenv.config();
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/info", infoRoutes);
  
export default app;
