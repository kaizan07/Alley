import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import ProductSale from "../models/ProductSale.js";
import CategorySale from "../models/CategorySale.js";

const router = express.Router();

// Quick stats: total products, orders, revenue, customers
router.get("/quick-stats", async (_req, res) => {
  const [products, orders, users, revenueAgg] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$total" } } },
    ]),
  ]);
  const revenue = revenueAgg[0]?.revenue || 0;
  res.json({ products, orders, revenue, customers: users });
});

// Revenue trends by day for last 30 days
router.get("/revenue-trends", async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json(data);
});

// Category-wise sales (from CategorySale)
router.get("/category-sales", async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const data = await CategorySale.aggregate([
    { $match: { date: { $gte: since } } },
    { $group: { _id: "$category", quantitySold: { $sum: "$quantitySold" } } },
    { $project: { category: "$_id", quantitySold: 1, _id: 0 } },
    { $sort: { quantitySold: -1 } },
  ]);
  res.json(data);
});

// Best-selling products (from ProductSale)
router.get("/best-sellers", async (_req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const data = await ProductSale.aggregate([
    { $match: { date: { $gte: since } } },
    { 
      $group: { 
        _id: "$productId", 
        quantitySold: { $sum: "$quantitySold" },
        productTitle: { $first: "$productTitle" },
        category: { $first: "$category" },
        avgPrice: { $avg: "$price" }
      } 
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 10 },
    {
      $project: {
        productId: "$_id",
        productTitle: "$productTitle",
        category: 1,
        quantitySold: 1,
        avgPrice: { $round: ["$avgPrice", 2] },
        _id: 0
      }
    }
  ]);
  res.json(data);
});

export default router;



