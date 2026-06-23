import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
});

export default mongoose.model("User", userSchema);
