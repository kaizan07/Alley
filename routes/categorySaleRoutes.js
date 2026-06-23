import express from "express";
import CategorySale from "../models/CategorySale.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const sale = new CategorySale(req.body);
    await sale.save();
    res.status(201).json({ message: "Category sale added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const sales = await CategorySale.find();
  res.json(sales);
});

export default router;
