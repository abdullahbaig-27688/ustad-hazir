import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth-module/login";
import Register from "./pages/auth-module/register";
import Dashboard from "./pages/dashboard-module/dashboard";
import ViewMechanics from "./pages/allmechanic-module/allmechanic";
import ViewCustomers from "./pages/allcustomer-module/allcustomer";
import CustomerDetails from "./pages/customer-detail-module/customerDetail";
import MechanicDetails from "./pages/mechanic-detail-module/mechanicDetail";
import CompletedJobs from "./pages/completed-jobs-module/completedJobs";
import AcceptedJobs from "./pages/accepted-jobs-module/acceptedJobs";
import PendingJobs from "./pages/pending-jobs-module/pendingJobs";
// import AdminGuard from "./guards/adminGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/allmechanic-module" element={<ViewMechanics />} />
      <Route path="/allcustomer-module" element={<ViewCustomers />} />
      <Route path="/customer-details/:id" element={<CustomerDetails />} />
      <Route path="/mechanic-details/:id" element={<MechanicDetails />} />
      <Route path="/completed-jobs-module" element={<CompletedJobs />} />
      <Route path="/accepted-jobs-module" element={<AcceptedJobs />} />
      <Route path="/pending-jobs-module" element={<PendingJobs />} />

      <Route path="/request-module" element={<h2>Requests Page</h2>} />

      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
