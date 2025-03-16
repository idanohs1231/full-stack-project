const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// 📌 Middleware להגנה על נתיבים (רק משתמשים מחוברים יכולים לגשת)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // 🔹 חילוץ ה-token
      token = req.headers.authorization.split(" ")[1];

      // 🔹 אם אין טוקן, נחזיר שגיאה
      if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
      }

      // 🔹 אימות הטוקן
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔹 מציאת המשתמש במסד הנתונים
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("❌ JWT Error:", error.message);
      return res.status(401).json({ message: "Unauthorized, invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }
};

// 📌 Middleware לבדיקה אם המשתמש הוא מנהל
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, admin access required" });
  }
};

// 📌 Middleware לבדיקה אם המשתמש מנהל או משתמש רגיל
const adminOrSelf = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user._id.toString() === req.params.id)) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden, you are not authorized" });
  }
};

module.exports = { protect, admin, adminOrSelf };
