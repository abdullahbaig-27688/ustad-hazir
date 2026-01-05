import { useState } from "react";
import InputFields from "../../components/inputFields";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1️⃣ Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Verify admin role from Firestore
      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        alert("Access denied. Admin account not found.");
        return;
      }

      alert("Login Successful!");

      setEmail("");
      setPassword("");

      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.message || "Login failed");
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
              <h1 className="brand-title">Ustad Hazir</h1>
              <p className="brand-desc">
                “Fast, trusted roadside help at your fingertips.”
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="form-container">
            <h2 className="welcome-text">Welcome</h2>
            <p className="subtitle">Please login to Admin Dashboard.</p>

            <form className="login-form" onSubmit={handleSubmit}>
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
                Login
              </button>

              <a href="/register" className="forgot-password">
                Don't have account? Register
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

export default Login;
