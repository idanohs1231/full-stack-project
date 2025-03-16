import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

// 📌 ספק עגלה (Cart Provider)
export const CartProvider = ({ children }) => {
  const getUser = () => JSON.parse(localStorage.getItem("user"));

  const [cart, setCart] = useState(() => {
    const user = getUser();
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.email}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [message, setMessage] = useState(null); // ✅ הודעה לאחר הוספה לעגלה

  // 📌 טעינת עגלת המשתמש מחדש בעת שינוי חשבון
  useEffect(() => {
    const user = getUser();
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.email}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCart([]); // מנקה את העגלה בעת התנתקות
    }
  }, [localStorage.getItem("user")]);

  // שמירת העגלה ב-localStorage לכל משתמש
  useEffect(() => {
    const user = getUser();
    if (user) {
      localStorage.setItem(`cart-${user.email}`, JSON.stringify(cart));
    }
  }, [cart]);

  // 📌 עדכון מלאי בשרת
  const updateStock = async (productId, quantityChange) => {
    try {
      await fetch(`/api/products/${productId}/updateStock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantityChange }),
      });
    } catch (error) {
      console.error("❌ שגיאה בעדכון המלאי בשרת:", error);
    }
  };

  // 📌 הוספת מוצר לעגלה עם עדכון מלאי מיידי
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          setMessage(`❌ לא ניתן להוסיף יותר מ-${product.stock} יחידות מהמוצר`);
          return prevCart;
        }
        updateStock(product._id, -1);
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1, stock: item.stock - 1 } : item
        );
      } else {
        if (product.stock > 0) {
          updateStock(product._id, -1);
          return [...prevCart, { ...product, quantity: 1, stock: product.stock - 1 }];
        } else {
          setMessage("❌ המוצר אזל מהמלאי");
          return prevCart;
        }
      }
    });

    setTimeout(() => setMessage(null), 3000);
  };

  // 📌 הסרת מוצר מהעגלה והחזרת המלאי
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => {
        if (item._id === productId) {
          updateStock(productId, item.quantity);
          item.stock += item.quantity; // מחזיר את הכמות למלאי
        }
        return item._id !== productId;
      });
    });
  };

  // 📌 ריקון העגלה (בשימוש ביציאה מהחשבון)
  const clearCart = () => {
    setCart([]);
    const user = getUser();
    if (user) {
      localStorage.removeItem(`cart-${user.email}`);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, message }}>
      {children}
    </CartContext.Provider>
  );
};

// 📌 שימוש בהקשר העגלה
export const useCart = () => useContext(CartContext);