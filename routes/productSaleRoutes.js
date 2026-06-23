import express from "express";
import ProductSale from "../models/ProductSale.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const sale = new ProductSale(req.body);
    await sale.save();
    res.status(201).json({ message: "Product sale added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const sales = await ProductSale.find();
  res.json(sales);
});

export default router;
