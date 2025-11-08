import { useState } from "react";
import InputFields from "../../components/inputFields";
import api from "../../services/api";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.loginAdmin({ email, password });
      localStorage.setItem("adminToken", data.token);
      alert("Login Successful!");
      setEmail("");
      setPassword("");
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="auth-page">
      <div className="overlay"></div>

      <div className="auth-container fade-in">
        <div className="auth-header">
          <img src="/logo.png" alt="Ustad Hazir Logo" className="auth-logo" />
          <h2 className="auth-title">Ustad-Hazir Admin Panel</h2>
          <p className="auth-subtitle">Your roadside car inspection partner</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <InputFields
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            required
          />
          <InputFields
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            required
          />

          <button type="submit" className="auth-btn">
            🚗 Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
