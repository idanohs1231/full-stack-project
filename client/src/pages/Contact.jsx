import { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    let newErrors = {};
    if (formData.name.length < 3) newErrors.name = "השם חייב להכיל לפחות 3 תווים";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "כתובת אימייל לא תקינה";
    if (formData.message.length < 10) newErrors.message = "ההודעה חייבת להכיל לפחות 10 תווים";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error("❌ Error sending email:", err);
      setError("שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">📞 צור קשר</h1>
      <p className="text-center text-muted">נשמח לשמוע ממך! מלא את הטופס ונחזור אליך בהקדם.</p>

      {submitted ? (
        <div className="alert alert-success text-center">✅ ההודעה נשלחה בהצלחה!</div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
          <div className="mb-3">
            <label className="form-label">שם מלא:</label>
            <input 
              type="text" 
              name="name" 
              className={`form-control ${errors.name ? "is-invalid" : ""}`} 
              required 
              onChange={handleChange} 
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">אימייל:</label>
            <input 
              type="email" 
              name="email" 
              className={`form-control ${errors.email ? "is-invalid" : ""}`} 
              required 
              onChange={handleChange} 
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">הודעה:</label>
            <textarea 
              name="message" 
              className={`form-control ${errors.message ? "is-invalid" : ""}`} 
              rows="4" 
              required 
              onChange={handleChange} 
            ></textarea>
            {errors.message && <div className="invalid-feedback">{errors.message}</div>}
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">📩 שלח הודעה</button>
        </form>
      )}
    </div>
  );
};

export default Contact;