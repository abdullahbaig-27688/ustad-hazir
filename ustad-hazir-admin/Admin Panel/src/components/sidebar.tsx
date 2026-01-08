// Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Import the CSS file

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Ustad Hazir</div>

      <nav className="sidebar-nav">
        <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
        {/* <button onClick={() => navigate("/customer-module")}>👤 Profile</button> */}
        <button onClick={() => navigate("/allcustomer-module")}>🧑‍🤝‍🧑 Customers</button>
        <button onClick={() => navigate("/allmechanic-module")}>🔧 Mechanics</button>
        <button onClick={() => navigate("/completed-jobs-module")}>📩 Completed Jobs</button>
        <button onClick={() => navigate("/accepted-jobs-module")}>✅ Accepted Jobs</button>
        <button onClick={() => navigate("/pending-jobs-module")}>🕒 Pending Jobs</button>
        <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        🔓 Logout
      </button>
    </aside>
  );
};

export default Sidebar;
