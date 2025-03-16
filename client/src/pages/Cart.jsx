import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";

const Cart = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [updatedCart, setUpdatedCart] = useState(cart);

  useEffect(() => {
    setUpdatedCart(cart);
  }, [cart]);

  const handleIncrease = (item) => {
    if (item.quantity < item.stock) {
      addToCart(item);
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      setUpdatedCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        )
      );
    } else {
      removeFromCart(item._id);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🛒 עגלת הקניות שלך</h1>
      {updatedCart.length === 0 ? (
        <p className="text-center">העגלה שלך ריקה.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>שם המוצר</th>
              <th>כמות</th>
              <th>מחיר</th>
              <th>מלאי זמין</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {updatedCart.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleDecrease(item)}
                    disabled={item.quantity <= 1}
                  >
                    ➖
                  </button>
                  {item.quantity}
                  <button
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={() => handleIncrease(item)}
                    disabled={item.quantity >= item.stock}
                  >
                    ➕
                  </button>
                </td>
                <td>₪{item.price * item.quantity}</td>
                <td>{item.stock}</td>
                <td>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item._id)}
                  >
                    ❌ הסר
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Cart;