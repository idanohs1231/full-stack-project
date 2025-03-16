import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails"; // ✅ הוספת דף פרטי מוצר
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar"; // ✅ הוספת ניווט נפרד
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import About from "./pages/About";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const expiryTime = localStorage.getItem("user_expiry");
      if (expiryTime && new Date().getTime() > Number(expiryTime)) {
        localStorage.removeItem("user");
        localStorage.removeItem("user_expiry");
        return null;
      }
      return parsedUser;
    }
    return null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      const expiryTime = new Date().getTime() + 4 * 60 * 60 * 1000; // 4 שעות
      localStorage.setItem("user_expiry", expiryTime.toString());

      const logoutTimer = setTimeout(() => {
        handleLogout();
      }, 4 * 60 * 60 * 1000);

      return () => clearTimeout(logoutTimer);
    }
  }, [user]);

  const handleLogin = (userData) => {
    const expiryTime = new Date().getTime() + 4 * 60 * 60 * 1000; // 4 שעות
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_expiry", expiryTime.toString());
    localStorage.setItem(`cart_${userData.email}`, JSON.stringify([]));
    setUser(userData);
    navigate("/");
  };

  const handleLogout = () => {
    if (user) {
      localStorage.removeItem(`cart_${user.email}`);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("user_expiry");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/users" element={user?.isAdmin ? <AdminUsers /> : <Home />} />
          <Route path="/admin/products" element={user?.isAdmin ? <AdminProducts /> : <Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
