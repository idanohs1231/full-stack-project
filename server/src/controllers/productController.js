const Product = require("../models/productModel");

// 📌 קבלת כל המוצרים עם חיפוש וסינון
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let query = {};

    // 🔍 חיפוש מוצרים לפי שם
    if (search) {
      query.name = { $regex: search, $options: "i" }; // חיפוש לא תלוי רישיות
    }

    // 📂 סינון לפי קטגוריה
    if (category) {
      query.category = category;
    }

    // 💰 סינון לפי טווח מחירים
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 קבלת מוצר לפי מזהה
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 הוספת מוצר חדש (רק למנהלים)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    if (!name || !price || !description || !image || !category || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, price, description, image, category, stock });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 עדכון מוצר קיים (רק למנהלים)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // עדכון שדות לפי מה שהתקבל
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 עדכון מלאי בעת הוספה/הסרה מהעגלה
const updateStock = async (req, res) => {
  try {
    const { productId, quantityChange } = req.body;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock + quantityChange < 0) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    product.stock += quantityChange;
    await product.save();

    res.json({ message: "Stock updated successfully", stock: product.stock });
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 מחיקת מוצר (רק למנהלים)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 הוספת ביקורת למוצר
const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // בדיקה אם המשתמש כבר השאיר ביקורת
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    // יצירת ביקורת חדשה
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("❌ Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, addProductReview, updateStock };