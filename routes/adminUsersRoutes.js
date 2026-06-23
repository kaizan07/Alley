import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();
const JWT_SECRET = "anuj@768421";

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
    next();
  } catch (err) {
    // Continue without authentication
    next();
  }
};

// Get all admin users
router.get("/", optionalAuth, async (_req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("name email role").sort({ name: 1 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create admin user
router.post("/", optionalAuth, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || "admin" 
    });
    await user.save();
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update role
router.patch("/:id/role", optionalAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (role !== "admin") return res.status(400).json({ error: "Only admin role is allowed" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete admin user
router.delete("/:id", optionalAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


