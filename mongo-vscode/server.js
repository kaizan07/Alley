const express = require("express");
const mongoose = require("mongoose");

const app = express();

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/testdb")
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB error ❌", err));

app.get("/", (req, res) => {
  res.send("MongoDB connected successfully!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});
