import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import productSaleRoutes from "./routes/productSaleRoutes.js";
import categorySaleRoutes from "./routes/categorySaleRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 
import uploadRoute from "./routes/upload.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminUsersRoutes from "./routes/adminUsersRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ecommerce_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use("/api/products", productRoutes);
app.use("/api/product-sales", productSaleRoutes);
app.use("/api/category-sales", categorySaleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/users", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

