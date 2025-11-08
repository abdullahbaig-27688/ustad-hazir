import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth-module/login";
import Register from "./pages/auth-module/register";
import Dashboard from "./pages/dashboard-module/dashboard"; // placeholder

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
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
