import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// Get user's cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.product')
      .exec();
    
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;
    
    // Validate required fields
    if (!userId || !productId || !quantity || !size || !color) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    
    // Check if item already exists with same size
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
              item.size === size
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.price
      });
    }
    
    await cart.save();
    
    // Populate product details for response
    await cart.populate('items.product');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item quantity
router.put("/update/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove item from cart
router.delete("/remove/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
