import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ onLogin }) => { // ✅ הוספת prop `onLogin` כדי לעדכן את הסטייט ב-App.jsx
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/"); // ✅ אם המשתמש מחובר, ננתב אותו לדף הבית
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }
    if (formData.password.length < 8) {
      newErrors.password = "הסיסמה חייבת להכיל לפחות 8 תווים";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data)); // ✅ שמירה ב-localStorage
        onLogin(data); // ✅ עדכון הסטייט של המשתמש מיד אחרי התחברות
        navigate("/"); // ✅ מעבר לדף הבית לאחר התחברות
      } else {
        setErrors({ server: data.message || "שגיאה בהתחברות" });
      }
    } catch (error) {
      console.error("שגיאה בהתחברות:", error);
      setErrors({ server: "שגיאת שרת, נסה שוב מאוחר יותר" });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🔑 התחברות</h1>
      <form onSubmit={handleSubmit} className="w-50 mx-auto border p-4 shadow rounded">
        {errors.server && <div className="alert alert-danger text-center">{errors.server}</div>}
        <div className="mb-3">
          <label className="form-label">אימייל</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="הכנס אימייל" 
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            required 
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">סיסמה</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="הכנס סיסמה" 
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            required 
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100">התחבר</button>
      </form>
    </div>
  );
};

export default Login;