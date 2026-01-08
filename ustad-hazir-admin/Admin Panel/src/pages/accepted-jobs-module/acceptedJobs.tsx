import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { getAllAcceptedJobs } from "../../services/getallacceptedjobs";
import "./acceptedJobs.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface Job {
  id: string;
  customerName: string;
  mechanicName: string;
  serviceType: string;
  vehicleId?: string;
  vehicleName?: string; // ✅ added
  status: "accepted";
}

export default function AcceptedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const getVehicleName = async (vehicleId?: string) => {
    if (!vehicleId) return "N/A";

    const snap = await getDoc(doc(db, "vehicles", vehicleId));

    if (!snap.exists()) return "N/A";

    const v = snap.data();
    return `${v.brand} ${v.model} (${v.year}) - ${v.color}`;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllAcceptedJobs();

        const enrichedJobs = await Promise.all(
          (data as Job[]).map(async (job) => {
            const vehicleName = await getVehicleName(job.vehicleId);

            return {
              ...job,
              vehicleName,
            };
          })
        );

        setJobs(enrichedJobs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  return (
    <div className="accepted-jobs-container">
      <Sidebar handleLogout={handleLogout} />

      <main className="accepted-jobs-content">
        <header className="accepted-jobs-header">
          <h2 className="section-title">📩 Completed Jobs</h2>
        </header>

        {loading && <p>Loading accepted jobs...</p>}

        {!loading && jobs.length === 0 && <p>No accepted jobs found.</p>}

        <div className="jobs-grid">
          {jobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h3>{job.customerName}</h3>

              <div className="job-info">
                <p>
                  <strong>Service:</strong> {job.serviceType}
                </p>
                <p>
                  <strong>Customer: {job.customerName}</strong>
                </p>
                <p>
                  <strong>Mechanic: {job.mechanicName}</strong>
                </p>
                <p>
                  <strong>Vehicle:</strong> {job.vehicleName}
                </p>

                <p className="status completed">Job Status: {job.status}</p>
              </div>

              <button className="card-btn">View Details</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
