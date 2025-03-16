import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedMessage, setAddedMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("שגיאה בטעינת פרטי המוצר:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      setAddedMessage("❌ המוצר אזל מהמלאי!");
      return;
    }
    addToCart(product);
    setProduct((prev) => ({ ...prev, stock: prev.stock - 1 }));
    setAddedMessage("✅ המוצר נוסף לעגלה בהצלחה!");
    setTimeout(() => setAddedMessage(""), 3000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setReviewMessage("עליך להתחבר כדי להשאיר ביקורת.");
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        setProduct((prev) => ({ ...prev, reviews: [...prev.reviews, data] }));
        setReviewMessage("✅ הביקורת נוספה בהצלחה!");
        setComment("");
        setRating(5);
      } else {
        setReviewMessage(data.message || "שגיאה בשליחת הביקורת.");
      }
    } catch (error) {
      console.error("❌ שגיאה בשליחת הביקורת:", error);
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <p className="text-center">🔄 טוען נתוני מוצר...</p>
      ) : product ? (
        <>
          <div className="row">
            <div className="col-md-6">
              <img
                src={product.image || "https://via.placeholder.com/400"}
                className="img-fluid rounded shadow"
                alt={product.name}
              />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold">{product.name}</h2>
              <p className="text-muted">{product.description}</p>
              <p className="fw-bold text-primary">₪{product.price}</p>
              <p className={`fw-bold ${product.stock > 0 ? "text-success" : "text-danger"}`}>
                {product.stock > 0 ? `✅ במלאי (${product.stock} יחידות)` : "❌ אזל מהמלאי"}
              </p>

              {localStorage.getItem("user") ? (
                <button
                  className="btn btn-success w-100"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  🛒 הוסף לעגלה
                </button>
              ) : (
                <p className="text-danger">🔒 התחבר כדי להוסיף לעגלה</p>
              )}

              {addedMessage && <p className="text-success mt-2">{addedMessage}</p>}
            </div>
          </div>

          <div className="mt-5">
            <h3>ביקורות</h3>
            {product.reviews.length === 0 ? (
              <p className="text-muted">❌ אין עדיין ביקורות.</p>
            ) : (
              product.reviews.map((review, index) => (
                <div key={index} className="border p-3 rounded mb-2 shadow-sm">
                  <strong>{review.name}</strong> ⭐ {review.rating}/5
                  <p>{review.comment}</p>
                  <small className="text-muted">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}

            <form onSubmit={submitReview} className="mt-4 border p-3 rounded shadow-sm">
              <h4>📝 השאר ביקורת</h4>
              {reviewMessage && <p className="text-danger">{reviewMessage}</p>}
              <div className="mb-3">
                <label className="form-label">דירוג:</label>
                <select
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} ⭐</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">תגובה:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                📩 שלח ביקורת
              </button>
            </form>
          </div>
        </>
      ) : (
        <p className="text-center text-danger">❌ מוצר לא נמצא.</p>
      )}
    </div>
  );
};

export default ProductDetails;
