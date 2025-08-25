import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import helmet from "helmet";

// import routes
import authRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import infoRoutes from "./routes/info.routes.js";
import subCategoryRoutes from "./routes/subcategory.routes.js";
import apiKeyRoutes from "./routes/apikey.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import { apiKeyMiddleware } from "./middleware/apiKeyMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDb();

const app = express();

// Security middleware
app.use(helmet());

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://next-pick-commerce.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", apiKeyMiddleware, productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/apikey", apiKeyRoutes);
app.use("/api/favorites", favoritesRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server ise dusdu localhost:${PORT}`);
});

export default app;
