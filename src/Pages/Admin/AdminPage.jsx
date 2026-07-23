import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

/** Checks session storage so login persists across re-renders but not page reloads */
const isAuthed = () => sessionStorage.getItem("admin_authed") === "true";

const AdminPage = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthed);

  const handleLogin  = () => setLoggedIn(true);
  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminPage;
