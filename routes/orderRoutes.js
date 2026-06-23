import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ProductSale from "../models/ProductSale.js";
import CategorySale from "../models/CategorySale.js";
import { sendOrderConfirmation } from "../utils/mailer.js";

const router = express.Router();

// Create order
router.post("/", async (req, res) => {
  try {
    const orderData = req.body;

    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({ error: "No items provided for order" });
    }

    // Normalize payment and status for simple checkout
    const paymentMethod = orderData?.payment?.method || "COD";
    const isDirectPaid = paymentMethod === "Direct" || orderData?.payment?.paid === true;
    orderData.payment = {
      method: paymentMethod,
      paid: isDirectPaid,
      transactionId: orderData?.payment?.transactionId,
    };
    // For COD or unpaid, mark Confirmed; for Direct paid, also Confirmed
    orderData.status = "Confirmed";
    
    // Validate that all products have sufficient stock
    for (const item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
      // Normalize item details: unit price and title fallbacks
      if (typeof item.price !== 'number') {
        item.price = product.price;
      }
      if (!item.title) {
        item.title = product.title;
      }
    }

    // Create the order
    const order = new Order(orderData);
    await order.save();

    // Update product stock and create sales records
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      
      // Update stock
      const newStock = product.stock - item.quantity;
      await Product.findByIdAndUpdate(item.product, { stock: newStock });
      
      // Create product sale record
      const productSale = new ProductSale({
        productId: item.product.toString(),
        date: order.createdAt,
        quantitySold: item.quantity,
        stockLeft: newStock,
        category: product.category,
        productTitle: product.title,
        price: item.price
      });
      await productSale.save();

      // Create category sale record
      const categorySale = new CategorySale({
        productId: item.product.toString(),
        date: order.createdAt,
        category: product.category,
        description: product.title,
        quantitySold: item.quantity,
      });
      await categorySale.save();
    }

    // Fire-and-forget email confirmation (non-blocking)
    try {
      const recipient = order?.shipping?.email;
      if (recipient) {
        // Do not await to keep response fast; log errors silently
        sendOrderConfirmation({ 
          to: recipient, 
          order, 
          customer: order.shipping 
        }).catch(() => {});
      }
    } catch {}

    res.status(201).json({
      _id: order._id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all orders
router.get("/", async (_req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "title price images").sort({ createdAt: -1 });
  res.json(orders);
});

// Get one order
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "title price images");
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Update order (general edits)
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update order status specifically
router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    const oldStatus = order.status;
    order.status = status;
    await order.save();

    // If order is cancelled, restore stock
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const newStock = product.stock + item.quantity;
          await Product.findByIdAndUpdate(item.product, { stock: newStock });
        }
      }
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ message: "Order deleted" });
});

export default router;


