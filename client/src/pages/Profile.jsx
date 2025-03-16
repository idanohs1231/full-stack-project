import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login"); // ✅ אם אין משתמש, ננתב אותו לדף התחברות
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) {
    return <h2 className="text-center mt-5">🔄 טוען פרופיל...</h2>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">👤 פרופיל משתמש</h1>
      <div className="card shadow-lg p-4 mt-4">
        <h3 className="text-primary">שלום, {user.name}!</h3>
        <p><strong>📧 אימייל:</strong> {user.email}</p>
        <p><strong>🔑 סטטוס:</strong> {user.isAdmin ? "מנהל" : "משתמש רגיל"}</p>
        <p><strong>🆔 מזהה משתמש:</strong> {user._id}</p>
      </div>
    </div>
  );
};

export default Profile;
