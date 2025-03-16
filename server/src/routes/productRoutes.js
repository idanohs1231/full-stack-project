const express = require("express");
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  addProductReview // ✅ הוספת פונקציה לביקורות
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 קבלת כל המוצרים עם חיפוש וסינון
router.get("/", getProducts);

// 📌 קבלת מוצר לפי מזהה
router.get("/:id", getProductById);

// 📌 הוספת מוצר חדש (רק למנהלים)
router.post("/", protect, admin, createProduct);

// 📌 עדכון מוצר (רק למנהלים)
router.put("/:id", protect, admin, updateProduct);

// 📌 מחיקת מוצר (רק למנהלים)
router.delete("/:id", protect, admin, deleteProduct);

// 📌 הוספת ביקורת למוצר (רק למשתמשים מחוברים)
router.post("/:id/reviews", protect, addProductReview);

module.exports = router;
