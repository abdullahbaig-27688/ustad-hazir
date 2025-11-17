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
import "./mechanicDetail.css"; // reuse customer-detail CSS

interface Mechanic {
  uid: string;
  name: string;
  email: string;
  contact: string;
  cnic?: string;
  experience?: string;
  specialization?: string;
  workshopName?: string;
  createdAt?: Timestamp;
}

interface Service {
  id: string;
  machenicId: string;
  serviceName: string;
  category: string;
  description: string;
  duration: string;
  price: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude: number;
    longitude: number;
  };
}

const MechanicDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMechanicAndServices = async () => {
      if (!id) return;

      try {
        // Fetch mechanic
        const mechDoc = doc(db, "users", id);
        const mechSnap = await getDoc(mechDoc);
        if (mechSnap.exists()) setMechanic(mechSnap.data() as Mechanic);

        // Fetch services
        const servicesRef = collection(db, "machenicServices");
        const q = query(servicesRef, where("machenicId", "==", id));
        const querySnapshot = await getDocs(q);
        const fetchedServices: Service[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Service, "id">),
        }));
        setServices(fetchedServices);
      } catch (err) {
        console.error("Error fetching mechanic data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanicAndServices();
  }, [id]);

  if (loading) return <p>Loading mechanic details...</p>;
  if (!mechanic) return <p>No mechanic found.</p>;

  return (
    <div className="customer-details">
      {/* reuse customer CSS */}
      <div className="customer-header">
        <h3>Mechanic Details</h3>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <div className="details-card">
        <p>
          <strong>Name:</strong> {mechanic.name}
        </p>
        <p>
          <strong>Email:</strong> {mechanic.email}
        </p>
        <p>
          <strong>Phone:</strong> {mechanic.contact}
        </p>
        <p>
          <strong>CNIC:</strong> {mechanic.cnic || "N/A"}
        </p>
        <p>
          <strong>Experience:</strong>{" "}
          {mechanic.experience ? `${mechanic.experience} years` : "N/A"}
        </p>
        <p>
          <strong>Specialization:</strong> {mechanic.specialization || "N/A"}
        </p>
        <p>
          <strong>Workshop:</strong> {mechanic.workshopName || "N/A"}
        </p>
        <p>
          <strong>Registered On:</strong>{" "}
          {mechanic.createdAt
            ? new Date(mechanic.createdAt.seconds * 1000).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
      {services.length > 0 && (
        <div className="service-section">
          <h3>Services Provided</h3>
          <div className="service-list">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-info">
                  <p>
                    <strong>Service Name:</strong> {service.serviceName}
                  </p>
                  <p>
                    <strong>Category:</strong> {service.category}
                  </p>
                  <p>
                    <strong>Description:</strong> {service.description}
                  </p>
                  <p>
                    <strong>Duration:</strong> {service.duration}
                  </p>
                  <p>
                    <strong>Price:</strong> {service.price}
                  </p>
                  <p>
                    <strong>Location:</strong> {service.location.address},{" "}
                    {service.location.city}, {service.location.state},{" "}
                    {service.location.country}
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

export default MechanicDetails;
