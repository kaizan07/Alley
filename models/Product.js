// models/Product.js
import mongoose from "mongoose";
import Counter from "./Counter.js";

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },
  title: String,
  category: String,
  description: String,
  price: Number,
  stock: Number,
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

productSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "productId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // create if not exist
    );
    this.productId = counter.seq;
  }
  next();
});

export default mongoose.model("Product", productSchema);
