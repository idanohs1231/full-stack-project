import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext"; // ✅ שימוש בניהול עגלה
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // ✅ פונקציה להוספת מוצרים לעגלה
  const [notifications, setNotifications] = useState({});

  // 🔍 משתנים לחיפוש וסינון
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]); // טווח מחיר עם סרגל
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    fetchProducts();
  }, [search, category, priceRange]);

  // 📌 שליפת מוצרים מהשרת עם סינון
  const fetchProducts = async () => {
    try {
      let query = `/api/products?`;
      if (search) query += `search=${search}&`;
      if (category) query += `category=${category}&`;
      query += `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`;

      const res = await fetch(query);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("שגיאה בטעינת מוצרים:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
      setNotifications((prev) => ({ ...prev, [product._id]: `✅ ${product.name} נוסף לעגלה!` }));

      setTimeout(() => {
        setNotifications((prev) => ({ ...prev, [product._id]: "" }));
      }, 3000);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🛍️ המוצרים שלנו</h1>

      {/* 🔍 טופס סינון */}
      <div className="row g-3 mb-4 align-items-center">
        <div className="col-12 col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="🔍 חפש מוצר..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select 
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">📂 כל הקטגוריות</option>
            <option value="תוספי תזונה">תוספי תזונה</option>
            <option value="ויטמינים">ויטמינים</option>
            <option value="ציוד כושר">ציוד כושר</option>
            <option value="טיפוח ואסתטיקה">טיפוח ואסתטיקה</option>
            <option value="שמנים אתריים">שמנים אתריים</option>
            <option value="מכשירי עיסוי">מכשירי עיסוי</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label d-block">💰 טווח מחירים: {priceRange[0]}₪ - {priceRange[1]}₪</label>
          <div className="d-flex align-items-center">
            <input 
              type="range" 
              className="form-range me-2"
              min="0" 
              max="500" 
              step="10" 
              value={priceRange[0]} 
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            />
            <input 
              type="range" 
              className="form-range"
              min="0" 
              max="500" 
              step="10" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">טוען מוצרים...</p>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="card shadow-sm product-card">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">
                      <Link to={`/products/${product._id}`} className="card-title h5 text-primary">
                        {product.name}
                      </Link>
                    </h5>
                    <p className="card-text">{product.description}</p>
                    <p className="fw-bold text-primary">₪{product.price}</p>
                    {product.stock > 0 ? (
                      user ? (
                        <>
                          <button 
                            className="btn btn-success w-100"
                            onClick={() => handleAddToCart(product)}
                          >
                            הוסף לעגלה 🛒
                          </button>
                          {notifications[product._id] && <p className="text-success mt-2">{notifications[product._id]}</p>}
                        </>
                      ) : (
                        <p className="text-danger">🔒 התחבר כדי להוסיף לעגלה</p>
                      )
                    ) : (
                      <p className="text-danger">❌ המוצר אזל מהמלאי</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">❌ לא נמצאו מוצרים.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;