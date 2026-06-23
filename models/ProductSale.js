import mongoose from "mongoose";

const productSaleSchema = new mongoose.Schema({
  productId: String,
  date: Date,
  quantitySold: Number,
  stockLeft: Number,
  category: String,
  productTitle: String,
  price: Number
});

export default mongoose.model("ProductSale", productSaleSchema);