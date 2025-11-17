import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [totalMechanics, setTotalMechanics] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [userRequests, setUserRequests] = useState(0);

  useEffect(() => {
    if (!adminToken) navigate("/login");
    // Fetch count for mechanics
    const fetchTotalMechanics = async () => {
      const q = query(collection(db, "users"), where("role", "==", "mechanic"));
      const snapshot = await getDocs(q);
      setTotalMechanics(snapshot.size);
    };
    // Fetch count of customers
    const fetchTotalCustomers = async () => {
      const q = query(collection(db, "users"), where("role", "==", "customer"));
      const snapshot = await getDocs(q);
      setTotalCustomers(snapshot.size);
    };
    fetchTotalMechanics();
    fetchTotalCustomers();
  }, [adminToken, navigate]);

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Ustad Hazir</h2>
        <ul>
          <li onClick={() => navigate("/dashboard")}>🏠 Dashboard</li>
          <li onClick={() => navigate("/allmechanic-module")}>🧰 Mechanics</li>
          <li onClick={() => navigate("/allcustomer-module")}>👥 Customers</li>
          <li onClick={() => navigate("/request-module")}>📩 Requests</li>
          <li
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/login");
            }}
          >
            🚪 Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
        </header>

        <section className="dashboard-content">
          <div className="card">
            <h3>🧰 Total Mechanics</h3>
            <p>{totalMechanics}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/allmechanic-module")}
            >
              View Mechanics
            </button>
          </div>

          <div className="card">
            <h3>👤 Total Customers</h3>
            <p>{totalCustomers}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/allcustomer-module")}
            >
              View Customers
            </button>
          </div>

          <div className="card">
            <h3>📩 User Requests</h3>
            <p>{userRequests}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/request-module")}
            >
              View Requests
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
