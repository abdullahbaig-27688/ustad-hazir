import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "../dashboard-module/dashboard.css"; // ✅ Use same CSS for consistent layout
import "./allmechanic.css";
interface Mechanic {
  id: string;
  name: string;
  email: string;
  contact: string;
  status: string;
}

const ViewMechanics = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    if (!adminToken) navigate("/login");
    const fetchMechanics = async (role: "customer" | "mechanic") => {
      const q = query(collection(db, "users"), where("role", "==", role));
      const querySnapShot = await getDocs(q);
      const mechanicData: Mechanic[] = [];
      querySnapShot.forEach((doc) => {
        const data = doc.data();
        mechanicData.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          contact: data.contact,
          status: data.status,
        });
      });

      setMechanics(mechanicData);
    };

    fetchMechanics("mechanic");
  }, [adminToken, navigate]);

  return (
    <div className="admin-wrapper">
      {/* Sidebar (same as dashboard) */}
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

      {/* Content */}
      <main className="admin-content">
        <header className="dashboard-header">
          <h2>Registered Mechanics</h2>
        </header>

        <section className="dashboard-content">
          {mechanics.map((mech) => (
            <div className="card" key={mech.id}>
              <h3>🧰 {mech.name}</h3>
              <p>
                <strong>Email:</strong> {mech.email}
              </p>
              <p>
                <strong>Phone:</strong> {mech.contact}
              </p>
              <p>
                <strong>Status:</strong> {mech.status}
              </p>
              <button
                className="card-btn"
                onClick={() => navigate(`/mechanic-details/${mech.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ViewMechanics;
