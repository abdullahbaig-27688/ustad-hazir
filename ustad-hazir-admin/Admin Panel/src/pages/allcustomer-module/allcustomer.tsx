import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Sidebar from "../../components/sidebar";
import "../dashboard-module/dashboard.css";
import "./allCustomer.css";

interface Customer {
  id: string;
  name: string;
  email: string;
  contact: string;
  status: string;
  vehicles: any[];
}

const ViewCustomers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const fetchCustomers = async () => {
        const q = query(
          collection(db, "users"),
          where("role", "==", "customer")
        );
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
        setLoading(false);
      };

      fetchCustomers();
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="customer-container">
      <Sidebar handleLogout={handleLogout} />

      <main className="customer-content">
        <header className="customer-header">
          <h2>🧑‍🤝‍🧑 Registered Customers</h2>
        </header>
        {loading && <p>Loading Registered Customers ...</p>}

        {!loading && customers.length === 0 && (
          <p>No Registered Customer found.</p>
        )}
        {/* ✅ Cards container */}
        <div className="customer-cards">
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
        </div>
      </main>
    </div>
  );
};

export default ViewCustomers;
