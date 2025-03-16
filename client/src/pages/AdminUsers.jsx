import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.isAdmin) {
      navigate("/"); // ❌ אם המשתמש לא מנהל, ננתב אותו חזרה לדף הבית
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("שגיאה בטעינת משתמשים:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המשתמש?")) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        await fetch(`/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });
        setUsers(users.filter((user) => user._id !== id)); // עדכון הרשימה לאחר מחיקה
      } catch (error) {
        console.error("❌ שגיאה במחיקת משתמש:", error);
      }
    }
  };

  const toggleAdmin = async (id, isAdmin) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.token}`,
        },
        body: JSON.stringify({ isAdmin: !isAdmin }),
      });

      if (res.ok) {
        setUsers(users.map(user => user._id === id ? { ...user, isAdmin: !isAdmin } : user));
      } else {
        console.error("❌ שגיאה בעדכון המשתמש");
      }
    } catch (error) {
      console.error("❌ שגיאה בעדכון משתמש:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center my-4">👥 רשימת משתמשים</h1>
      {loading ? (
        <p className="text-center">טוען משתמשים...</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "מנהל" : "משתמש רגיל"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => toggleAdmin(user._id, user.isAdmin)}
                  >
                    {user.isAdmin ? "🛑 הסר מנהל" : "✅ הפוך למנהל"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user._id)}
                  >
                    🗑️ מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
