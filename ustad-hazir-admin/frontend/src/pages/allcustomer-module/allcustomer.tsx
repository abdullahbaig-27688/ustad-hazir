import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "../dashboard-module/dashboard.css"; // ✅ Same CSS ensures perfect alignment
import "./allCustomer.css";
interface Vehicle {
  id: string;
  model: string;
  plate: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  contact: string;
  status: string;
  vehicles?: Vehicle[];
}

const ViewCustomers = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (!adminToken) navigate("/login");
    const fetchCustomers = async (role: "customer" | "mechanic") => {
      const q = query(collection(db, "users"), where("role", "==", role));
      const querySnapShot = await getDocs(q);
      const customersData: Customer[] = [];
      querySnapShot.forEach((doc) => {
        const data = doc.data();
        customersData.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          contact: data.contact,
          status: data.status,
          vehicles: data.vehicles || [],
        });
      });

      setCustomers(customersData);
    };

    fetchCustomers("customer");
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

      {/* Content */}
      <main className="admin-content">
        <header className="dashboard-header">
          <h2>Registered Customers</h2>
        </header>
        <section className="dashboard-content">
          {customers.map((cust) => (
            <div className="card" key={cust.id}>
              <h3>👤 {cust.name}</h3>
              <p>
                <strong>Email:</strong> {cust.email}
              </p>
              <p>
                <strong>Phone:</strong> {cust.contact}
              </p>
              <p>
                <strong>Status:</strong> {cust.status}
              </p>
              <button
                className="card-btn"
                 onClick={() => navigate(`/customer-details/${cust.id}`)}
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

export default ViewCustomers;
