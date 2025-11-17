import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth-module/login";
import Register from "./pages/auth-module/register";
import Dashboard from "./pages/dashboard-module/dashboard"; // placeholder
import ViewMechanics from "./pages/allmechanic-module/allmechanic";
import ViewCustomers from "./pages/allcustomer-module/allCustomer";
import CustomerDetails from "./pages/customer-detail-module/customerDetail";
import MechanicDetails from "./pages/mechanic-detail-module/mechanicDetail";

function App() {
  const isLoggedIn = !!localStorage.getItem("adminToken"); // simple auth check

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="/allmechanic-module" element={<ViewMechanics />} />
      <Route path="/allcustomer-module" element={<ViewCustomers />} />
      <Route path="/customer-details/:id" element={<CustomerDetails />} />
      <Route path="/mechanic-details/:id" element={<MechanicDetails />} />
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
