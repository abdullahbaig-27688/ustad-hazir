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
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section */}
        <div className="login-left">
          <div className="divider" />
          <div className="brand-section">
            <img
              src="public/logo.png"
              alt="Bailey Logo"
              className="brand-logo"
            />
            <div>
              <h1 className="brand-title">Ustad Hazir.</h1>
              <p className="brand-desc">
                “Fast, trusted roadside help at your fingertips.”
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="form-container">
            <h2 className="welcome-text">Register</h2>
            <p className="subtitle">Please create your admin account.</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <InputFields
                type="text"
                label="Full Name"
                placeholder="Enter your Full Name"
                value={name}
                onChange={setName}
                required
              />
              <InputFields
                type="email"
                label="Email"
                placeholder="Enter Email"
                value={email}
                onChange={setEmail}
                required
              />
              <InputFields
                type="password"
                label="Password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
                required
              />
              <button type="submit" className="login-btn">
                Register
              </button>
              <a href="/login" className="forgot-password">
                Already have an account? Login
              </a>
            </form>

            <footer className="footer-text">
              © {new Date().getFullYear()} Bailey and Co. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
