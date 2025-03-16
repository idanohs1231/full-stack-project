import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/productModel.js";
import products from "../data/products.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany(); // מנקה את כל המוצרים הקיימים
    await Product.insertMany(products); // מוסיף את המוצרים החדשים
    console.log("✅ נתוני המוצרים הוזנו בהצלחה!");
    process.exit();
  } catch (error) {
    console.error("❌ שגיאה בטעינת הנתונים:", error);
    process.exit(1);
  }
};

importData();
