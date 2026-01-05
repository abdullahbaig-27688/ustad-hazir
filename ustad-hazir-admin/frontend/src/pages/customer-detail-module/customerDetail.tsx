import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Sidebar from "../../components/Sidebar"; // ✅ import sidebar
import "./customerDetail.css";

interface Vehicle {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  type: string;
  color: string;
  fueltype: string;
  transmission: string;
  registration: string;
  year: string;
  imageUri?: string | null;
}

interface Customer {
  name: string;
  email: string;
  contact: string;
  createdAt?: Timestamp;
}

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const userSnap = await getDoc(doc(db, "users", id));
        if (userSnap.exists()) setCustomer(userSnap.data() as Customer);

        const q = query(
          collection(db, "vehicles"),
          where("ownerId", "==", id)
        );
        const snap = await getDocs(q);

        setVehicles(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Vehicle) }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>No customer found</p>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar handleLogout={() => navigate("/login")} />

      {/* Main Content */}
      <div className="admin-content customer-details">
        <div className="customer-header">
          <h2>Customer Details</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="details-card">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.contact}</p>
          <p>
            <strong>Registered On:</strong>{" "}
            {customer.createdAt
              ? new Date(customer.createdAt.seconds * 1000).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        {vehicles.length > 0 && (
          <div className="vehicle-section">
            <h3>Registered Vehicles</h3>
            <div className="vehicle-list">
              {vehicles.map((v) => (
                <div key={v.id} className="vehicle-card">
                  {v.imageUri && <img src={v.imageUri} alt={v.model} />}
                  <div className="vehicle-info">
                    <p><strong>Brand:</strong> {v.brand}</p>
                    <p><strong>Model:</strong> {v.model}</p>
                    <p><strong>Type:</strong> {v.type}</p>
                    <p><strong>Color:</strong> {v.color}</p>
                    <p><strong>Fuel:</strong> {v.fueltype}</p>
                    <p><strong>Transmission:</strong> {v.transmission}</p>
                    <p><strong>Registration:</strong> {v.registration}</p>
                    <p><strong>Year:</strong> {v.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
