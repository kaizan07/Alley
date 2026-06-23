import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    payment: {
      method: { type: String, default: "COD" },
      paid: { type: Boolean, default: false },
      transactionId: { type: String },
    },
    shipping: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  this.total = this.subtotal + (this.shippingFee || 0);
  next();
});

export default mongoose.model("Order", orderSchema);



