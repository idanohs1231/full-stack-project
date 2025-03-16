require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const logger = require("./utils/logger"); // ✅ הוספת לוגר

// 📌 חיבור למסד הנתונים
connectDB();

const app = express();

// 📌 Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// 📌 לוגים לכל בקשה נכנסת
app.use((req, res, next) => {
  logger.info(`🔵 בקשה חדשה: ${req.method} ${req.url}`);
  next();
});

// 📌 בדיקה אם ה-API עובד
app.get("/", (req, res) => {
  logger.info("🏠 דף הבית נטען");
  res.send("✅ API is running...");
});

// 📌 נתיבים (Routes)
try {
  app.use("/api/users", require("./routes/userRoutes"));
  app.use("/api/products", require("./routes/productRoutes"));
  app.use("/api/orders", require("./routes/orderRoutes"));
} catch (error) {
  logger.error("❌ Error loading routes: " + error.message);
}

// 📌 טיפול בנתיב שאינו קיים
app.use((req, res) => {
  logger.warn(`⚠️ Route not found: ${req.originalUrl}`);
  res.status(404).json({ message: "❌ Route not found" });
});

// 📌 Middleware לטיפול בשגיאות כלליות
app.use((err, req, res, next) => {
  logger.error("❌ Server Error: " + err.message);
  res.status(500).json({ message: "❌ Internal Server Error" });
});

// 📌 הפעלת השרת
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
