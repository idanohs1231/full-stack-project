const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  stock: { type: Number, required: true, default: 10 }, // ✅ ניהול מלאי
  reviews: [reviewSchema], // ✅ הוספת ביקורות
  rating: { type: Number, default: 0 }, // ✅ ממוצע דירוגים
  numReviews: { type: Number, default: 0 }, // ✅ כמות ביקורות
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
