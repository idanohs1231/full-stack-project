import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { name, email, password } = formData;

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (name.length < 3) newErrors.name = "השם חייב להכיל לפחות 3 תווים";
    if (!emailRegex.test(email)) newErrors.email = "כתובת אימייל לא תקינה";
    if (!passwordRegex.test(password)) {
      newErrors.password = "הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד";
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

    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data)); // ✅ שמירה ב-localStorage
      alert("נרשמת בהצלחה!");
      window.location.href = "/profile"; // ✅ מעבר לעמוד הפרופיל אחרי ההרשמה
    } else {
      setErrors({ ...errors, server: data.message || "שגיאה בהרשמה" });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">הרשמה</h1>
      <form onSubmit={handleSubmit} className="w-50 mx-auto border p-4 rounded shadow">
        <div className="mb-3">
          <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={handleChange} 
            className={`form-control ${errors.name ? "is-invalid" : ""}`} 
            placeholder="שם מלא" 
            required 
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={handleChange} 
            className={`form-control ${errors.email ? "is-invalid" : ""}`} 
            placeholder="אימייל" 
            required 
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={handleChange} 
            className={`form-control ${errors.password ? "is-invalid" : ""}`} 
            placeholder="סיסמה" 
            required 
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        {errors.server && <div className="alert alert-danger">{errors.server}</div>}
        <button type="submit" className="btn btn-primary w-100">הרשמה</button>
      </form>
    </div>
  );
};

export default Register;