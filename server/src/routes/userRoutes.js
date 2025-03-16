const express = require("express");
const { 
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser,
  updateUserStatus
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const { body } = require("express-validator"); // ✅ ולידציה של express-validator

const router = express.Router();

// 📌 הרשמה עם ולידציה
router.post(
  "/register",
  [
    body("name").isString().isLength({ min: 3, max: 50 }).withMessage("השם חייב להכיל בין 3 ל-50 תווים"),
    body("email").isEmail().withMessage("כתובת האימייל אינה תקינה"),
    body("password")
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage("סיסמה חייבת להכיל לפחות 8 תווים, אות קטנה, אות גדולה, מספר ותו מיוחד"),
  ],
  registerUser
);

// 📌 התחברות עם ולידציה
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("כתובת האימייל אינה תקינה"),
    body("password").notEmpty().withMessage("סיסמה הינה חובה"),
  ],
  loginUser
);

// 📌 קבלת פרופיל משתמש (רק מחוברים)
router.get("/profile", protect, getUserProfile);

// 📌 קבלת רשימת כל המשתמשים (רק למנהלים)
router.get("/", protect, admin, getUsers); // 🔒 מסלול שמור למנהלים בלבד

// 📌 מחיקת משתמש (רק למנהלים)
router.delete("/:id", protect, admin, deleteUser);

// 📌 עדכון סטטוס משתמש (רק למנהלים) עם ולידציה
router.put(
  "/:id",
  protect,
  admin,
  [
    body("isAdmin").isBoolean().withMessage("isAdmin חייב להיות ערך בוליאני (true/false)"),
  ],
  updateUserStatus
);

module.exports = router;