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
import "./customerDetail.css";

// Types
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
  createdAt?: string;
  updatedAt?: string;
}

interface Customer {
  id?: string;
  name: string;
  email: string;
  contact: string;
  address?: string;
  createdAt?: Timestamp;
  totalRequests?: number;
  lastRequestStatus?: string;
}

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerAndVehicles = async () => {
      try {
        if (!id) return;

        // Fetch customer info
        const userDoc = doc(db, "users", id);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setCustomer(userSnap.data() as Customer);
        } else {
          console.log("No such customer!");
        }

        // Fetch vehicles for this customer
        const vehiclesRef = collection(db, "vehicles");
        const q = query(vehiclesRef, where("ownerId", "==", id));
        const querySnapshot = await getDocs(q);

        const fetchedVehicles: Vehicle[] = querySnapshot.docs.map((doc) => {
          const { id: _ignored, ...vehicleData } = doc.data() as Vehicle;
          return {
            id: doc.id,
            ...vehicleData,
          };
        });

        setVehicles(fetchedVehicles);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerAndVehicles();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>No customer found.</p>;

  return (
    <div className="customer-details">
      <div className="customer-header">
        <h2>Customer Details</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="details-card">
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Phone:</strong> {customer.contact}
        </p>
        {/* <p><strong>Address:</strong> {customer.address || "N/A"}</p> */}
        <p>
          <strong>Registered On:</strong>{" "}
          {customer.createdAt
            ? new Date(customer.createdAt.seconds * 1000).toLocaleDateString()
            : "N/A"}
        </p>
        {/* <p><strong>Total Requests:</strong> {customer.totalRequests ?? 0}</p> */}
        {/* <p><strong>Last Request Status:</strong> {customer.lastRequestStatus || "N/A"}</p> */}
      </div>

      {vehicles.length > 0 && (
        <div className="vehicle-section">
          <h3>Registered Vehicles</h3>
          <div className="vehicle-list">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                {vehicle.imageUri && (
                  <img
                    src={vehicle.imageUri}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                  />
                )}
                <div className="vehicle-info">
                  <p>
                    <strong>Brand:</strong> {vehicle.brand}
                  </p>
                  <p>
                    <strong>Model:</strong> {vehicle.model}
                  </p>
                  <p>
                    <strong>Type:</strong> {vehicle.type}
                  </p>
                  <p>
                    <strong>Color:</strong> {vehicle.color}
                  </p>
                  <p>
                    <strong>Fuel:</strong> {vehicle.fueltype}
                  </p>
                  <p>
                    <strong>Transmission:</strong> {vehicle.transmission}
                  </p>
                  <p>
                    <strong>Registration:</strong> {vehicle.registration}
                  </p>
                  <p>
                    <strong>Year:</strong> {vehicle.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
