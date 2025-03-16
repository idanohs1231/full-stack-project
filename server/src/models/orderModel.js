const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // קישור למודל משתמשים
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // קישור למודל מוצרים
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "כמות חייבת להיות לפחות 1"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "סכום כולל נדרש"],
      min: [0, "המחיר לא יכול להיות שלילי"],
    },
    status: {
      type: String,
      enum: ["בטיפול", "נשלחה", "הושלמה", "מבוטלת"],
      default: "בטיפול",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
