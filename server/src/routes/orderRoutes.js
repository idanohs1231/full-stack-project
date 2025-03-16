const express = require("express");
const { 
  getOrders, 
  createOrder, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder 
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// יצירת הזמנה - רק משתמשים מחוברים
router.post("/", protect, createOrder);

// קבלת כל ההזמנות - רק למנהלים
router.get("/", protect, admin, getOrders);

// קבלת הזמנה לפי מזהה - משתמש מחובר יכול לראות רק את ההזמנה שלו
router.get("/:id", protect, getOrderById);

// עדכון סטטוס הזמנה - רק למנהלים
router.put("/:id", protect, admin, updateOrderStatus);

// מחיקת הזמנה - רק למנהלים
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
