import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/login"); // redirect if not logged in
    }
  }, [adminToken, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </header>

        <section className="dashboard-content">
          <div className="card">
            <h3>👤 Customers</h3>
            <p>View and manage all customer accounts.</p>
            <button className="card-btn">View Customers</button>
          </div>

          <div className="card">
            <h3>🧰 Mechanics</h3>
            <p>View and manage all mechanic profiles.</p>
            <button className="card-btn">View Mechanics</button>
          </div>

          <div className="card">
            <h3>⚙️ Settings</h3>
            <p>Manage your admin preferences and configuration.</p>
            <button className="card-btn">Open Settings</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
