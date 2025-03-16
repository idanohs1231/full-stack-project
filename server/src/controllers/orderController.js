const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// קבלת כל ההזמנות (למנהלים בלבד)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price");

    res.json(orders);
  } catch (error) {
    console.error("שגיאה בקבלת הזמנות:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

// יצירת הזמנה חדשה (רק למשתמשים מחוברים)
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "הזמנה חייבת לכלול מוצרים" });
    }

    let totalCalculatedPrice = 0;
    const updatedProducts = [];

    // בדיקה אם כל המוצרים קיימים, מלאי זמין ועדכון מחיר כולל
    for (let item of products) {
      const productExists = await Product.findById(item.product);
      if (!productExists) {
        return res.status(404).json({ message: `המוצר עם ID ${item.product} לא נמצא` });
      }

      if (productExists.stock < item.quantity) {
        return res.status(400).json({ message: `המוצר "${productExists.name}" אזל מהמלאי` });
      }

      totalCalculatedPrice += productExists.price * item.quantity;

      // הכנת העדכון להפחתת המלאי
      updatedProducts.push({
        productId: item.product,
        newStock: productExists.stock - item.quantity,
      });
    }

    // בדיקה שהמחיר שסופק תואם למחיר בפועל
    if (totalPrice !== totalCalculatedPrice) {
      return res.status(400).json({ message: "המחיר הכולל שסופק אינו תואם למחיר בפועל של המוצרים" });
    }

    // יצירת הזמנה
    const order = new Order({
      user: req.user._id,
      products,
      totalPrice,
    });

    await order.save();

    // עדכון המלאי במסד הנתונים
    for (let item of updatedProducts) {
      await Product.findByIdAndUpdate(item.productId, { stock: item.newStock });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("שגיאה ביצירת הזמנה:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

// קבלת הזמנה לפי מזהה (משתמש יכול לראות רק את ההזמנות שלו, מנהלים רואים הכל)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "הזמנה לא נמצאה" });
    }

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "אין לך הרשאה לצפות בהזמנה זו" });
    }

    res.json(order);
  } catch (error) {
    console.error("שגיאה בקבלת הזמנה לפי מזהה:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

// עדכון סטטוס הזמנה (רק למנהלים)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "הזמנה לא נמצאה" });

    order.status = req.body.status || order.status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("שגיאה בעדכון סטטוס הזמנה:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

// מחיקת הזמנה (רק למנהלים)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "הזמנה לא נמצאה" });

    res.json({ message: "ההזמנה נמחקה בהצלחה" });
  } catch (error) {
    console.error("שגיאה במחיקת הזמנה:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
};

module.exports = { getOrders, createOrder, getOrderById, updateOrderStatus, deleteOrder };