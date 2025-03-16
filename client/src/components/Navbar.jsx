import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark-custom" : "navbar-light bg-primary"} sticky-top shadow-sm p-3`}> 
      <div className="container">
        {/* לוגו וניווט ראשי */}
        <Link className="navbar-brand text-white fw-bold" to="/" onClick={() => setIsOpen(false)}>
          🏠 דף הבית
        </Link>
        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/products" onClick={() => setIsOpen(false)}>🛍️ חנות</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about" onClick={() => setIsOpen(false)}>ℹ️ אודות</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/contact" onClick={() => setIsOpen(false)}>📞 צור קשר</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/cart" onClick={() => setIsOpen(false)}>🛒 עגלה</Link>
              </li>
            )}
          </ul>

          {/* פונקציות נוספות */}
          <ul className="navbar-nav d-flex align-items-center gap-3">
            {/* כפתור מצב כהה/בהיר */}
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "☀️ מצב בהיר" : "🌙 מצב כהה"}
              </button>
            </li>
            
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/profile" onClick={() => setIsOpen(false)}>👤 פרופיל</Link>
                </li>
                {user.isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/admin/users" onClick={() => setIsOpen(false)}>🔧 ניהול משתמשים</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/admin/products" onClick={() => setIsOpen(false)}>📦 ניהול מוצרים</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button className="btn btn-danger ms-3 logout-btn" onClick={() => { onLogout(); setIsOpen(false); }}>🚪 התנתק</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-light text-dark" to="/login" onClick={() => setIsOpen(false)}>🔑 התחברות</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning text-dark" to="/register" onClick={() => setIsOpen(false)}>📝 הרשמה</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
