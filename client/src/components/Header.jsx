import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header>
      <h1>חנות מוצרי בריאות</h1>
      {user ? <p>שלום, {user.name}!</p> : <p>אורח</p>}
    </header>
  );
};

export default Header;
