import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <div className="container text-center mt-5">
 <h1 className="display-4 fw-bold text-dark text-light-dark">החנות המובילה למוצרי בריאות 🌿</h1>
      <p className="lead text-muted">
        כאן תוכל למצוא את כל המוצרים הבריאותיים שלנו – החל מתוספי תזונה, מוצרי טיפוח טבעיים, ציוד כושר מתקדם ועוד.
      </p>

      {/* ✅ כפתור לחנות */}
      <Link to="/products" className="btn btn-success btn-lg mt-3">🛒 גלה את המוצרים שלנו</Link>
    </div>
  );
};

export default Home;