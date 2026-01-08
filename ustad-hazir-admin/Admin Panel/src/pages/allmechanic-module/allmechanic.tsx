import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import Sidebar from "../../components/sidebar";
import "../dashboard-module/dashboard.css";
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
  const [loading, setLoading] = useState(true);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const fetchMechanics = async () => {
        const q = query(
          collection(db, "users"),
          where("role", "==", "mechanic")
        );
        const snapshot = await getDocs(q);
        const mechanicData: Mechanic[] = [];
        snapshot.forEach((doc) => {
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
        setLoading(false);
      };

      fetchMechanics();
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="mechanic-container">
      <Sidebar handleLogout={handleLogout} />

      <main className="mechanic-content">
        <header className="mechanic-header">
          <h2>🔧 Registered Mechanics</h2>
        </header>
        {loading && <p>Loading Registered Mechanics...</p>}

        {!loading && mechanics.length === 0 && (
          <p>No Registered Mechanics found.</p>
        )}
        {/* ✅ Cards container */}
        <div className="mechanic-cards">
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
        </div>
      </main>
    </div>
  );
};

export default ViewMechanics;
