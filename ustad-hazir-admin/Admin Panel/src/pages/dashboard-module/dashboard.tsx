import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import Sidebar from "../../components/sidebar";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [totalMechanics, setTotalMechanics] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [userRequests, setUserRequests] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [acceptedJobs, setAcceptedJobs] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const adminSnap = await getDocs(
        query(collection(db, "admins"), where("email", "==", user.email))
      );
      if (adminSnap.empty) {
        alert("Access denied");
        await signOut(auth);
        navigate("/login");
        return;
      }

      const fetchTotalMechanics = async () => {
        const snapshot = await getDocs(
          query(collection(db, "users"), where("role", "==", "mechanic"))
        );
        setTotalMechanics(snapshot.size);
      };

      const fetchTotalCustomers = async () => {
        const snapshot = await getDocs(
          query(collection(db, "users"), where("role", "==", "customer"))
        );
        setTotalCustomers(snapshot.size);
      };

      const fetchUserRequests = async () => {
        const snapshot = await getDocs(collection(db, "requests"));
        setUserRequests(snapshot.size);
      };
      const fetchCompletedJobs = async () => {
        const snapshot = await getDocs(
          query(
            collection(db, "serviceRequests"),
            where("status", "==", "completed")
          )
        );
        setCompletedJobs(snapshot.size);
      };

      const fetchAcceptedJobs = async () => {
        const snapshot= await getDocs(
          query(
            collection(db, "serviceRequests"),
            where("status", "==", "accepted")
          )
        );
        setAcceptedJobs(snapshot.size);
      }
      const fetchPendingJobs = async () => {
        const snapshot = await getDocs(
          query(
            collection(db, "serviceRequests"),
            where("status", "==", "pending")
          )
        );
        setPendingJobs(snapshot.size);
      };

      await Promise.all([
        fetchTotalMechanics(),
        fetchTotalCustomers(),
        fetchUserRequests(),
        fetchCompletedJobs(),
        fetchAcceptedJobs(),
        fetchPendingJobs(),
      ]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main content */}
      <div className="dashboard-content">
        {/* <h2>Admin Dashboard</h2> */}

        <div className="cards">
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
            <h3>📩 Active Users</h3>
            <p>{userRequests}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/request-module")}
            >
              View Requests
            </button>
          </div>
          {/* <div className="card">
            <h3>📩 Today's Requests</h3>
            <p>{userRequests}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/request-module")}
            >
              View Requests
            </button>
          </div> */}

          <div className="card">
            <h3>📩 Completed Jobs</h3>
            <p>{completedJobs}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/completed-jobs-module")}
            >
              View Requests
            </button>
          </div>
           <div className="card">
            <h3>📩 Accepted Jobs</h3>
            <p>{acceptedJobs}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/accepted-jobs-module")}
            >
              View Requests
            </button>
          </div>

          <div className="card">
            <h3>📩 Pending Jobs</h3>
            <p>{pendingJobs}</p>
            <button
              className="card-btn"
              onClick={() => navigate("/pending-jobs-module")}
            >
              View Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
