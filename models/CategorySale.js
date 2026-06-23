import mongoose from "mongoose";

const categorySaleSchema = new mongoose.Schema({
  productId: String,
  date: Date,
  category: String,
  description: String,
  quantitySold: Number
});

export default mongoose.model("CategorySale", categorySaleSchema);
