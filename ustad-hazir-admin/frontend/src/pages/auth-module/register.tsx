import { useState } from "react";
import InputFields from "../../components/inputFields";
import api from "../../services/api";
import "./auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.registerAdmin({ name, email, password });
      alert("Registration Successful!");
      setName("");
      setEmail("");
      setPassword("");
      window.location.href = "/login";
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
          <h2 className="auth-title">Create Admin Account</h2>
          <p className="auth-subtitle">
            Join <strong>Ustad-Hazir</strong> — the roadside inspection platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <InputFields
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={setName}
            required
          />
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
            placeholder="Create a secure password"
            value={password}
            onChange={setPassword}
            required
          />

          <button type="submit" className="auth-btn">
            🚗 Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
