import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", price: "", description: "", image: "", category: "", stock: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/"); // ✅ ניתוב חזרה לדף הבית אם המשתמש לא מחובר
    } else {
      const user = JSON.parse(storedUser);
      if (!user.isAdmin) {
        navigate("/"); // ✅ אם המשתמש אינו מנהל, נמנע גישה
      }
    }

    fetchProducts();
  }, [navigate]);

  // 📌 שליפת כל המוצרים מהשרת
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("שגיאה בטעינת מוצרים:", error);
    }
  };

  // 📌 מחיקת מוצר
  const deleteProduct = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק מוצר זה?")) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}` },
        });

        if (res.ok) {
          alert("המוצר נמחק בהצלחה!");
          fetchProducts();
        } else {
          alert("שגיאה במחיקת מוצר");
        }
      } catch (error) {
        console.error("שגיאה במחיקת מוצר:", error);
      }
    }
  };

  // 📌 טיפול בשינוי ערכי הטופס
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📌 שליחת מוצר חדש או עדכון קיים
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `/api/products/${editingProduct}` : "/api/products";

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingProduct ? "המוצר עודכן בהצלחה!" : "המוצר נוסף בהצלחה!");
        setFormData({ name: "", price: "", description: "", image: "", category: "", stock: "" });
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert("שגיאה בניהול מוצר");
      }
    } catch (error) {
      console.error("שגיאה בניהול מוצר:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">🔧 ניהול מוצרים</h1>

      {/* טופס להוספה/עדכון מוצר */}
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm mt-4">
        <h5>{editingProduct ? "✏️ עריכת מוצר" : "➕ הוספת מוצר חדש"}</h5>
        <div className="mb-3">
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="שם מוצר" required />
        </div>
        <div className="mb-3">
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" placeholder="מחיר (₪)" required />
        </div>
        <div className="mb-3">
          <input type="text" name="description" value={formData.description} onChange={handleChange} className="form-control" placeholder="תיאור מוצר" required />
        </div>
        <div className="mb-3">
          <input type="text" name="image" value={formData.image} onChange={handleChange} className="form-control" placeholder="קישור לתמונה" required />
        </div>
        <div className="mb-3">
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" placeholder="קטגוריה" required />
        </div>
        <div className="mb-3">
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-control" placeholder="מלאי זמין" required />
        </div>
        <button type="submit" className="btn btn-success w-100">{editingProduct ? "💾 עדכן מוצר" : "➕ הוסף מוצר"}</button>
      </form>

      {/* טבלת מוצרים */}
      {loading ? <p>טוען...</p> : (
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>שם</th>
              <th>מחיר</th>
              <th>קטגוריה</th>
              <th>מלאי</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>₪{product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => {
                    setEditingProduct(product._id);
                    setFormData(product);
                  }}>✏️ עריכה</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product._id)}>🗑️ מחיקה</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;