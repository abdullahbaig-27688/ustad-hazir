import React, { useState } from "react";
import "./notification.css";
import Sidebar from "../../components/sidebar";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { addNotofcation } from "../../services/addNotification";

const Notification = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [sendTo, setSendTo] = useState("all");
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !message) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            await addNotofcation(title, message, sendTo);

            alert("✅ Notification sent successfully!");

            setTitle("");
            setMessage("");
            setSendTo("all");
        } catch (error) {
            console.error("Error creating notification:", error);
            alert("❌ Failed to send notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="notification-container">
            <Sidebar handleLogout={handleLogout} />

            <div className="notification-content">
                <div className="notification-header">
                    <h1 className="notification-title">🔔 Add Notification</h1>
                </div>

                <div className="notification-grid">
                    <div className="notification-field-card">
                        <form onSubmit={handleSubmit}>
                            <h3>Notification Details</h3>

                            <div className="notification-info">
                                <p><strong>Title</strong></p>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="notification-input-field"
                                />

                                <p><strong>Message</strong></p>
                                <textarea
                                    placeholder="Enter message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="notification-input-field"
                                />

                                <p><strong>Send To</strong></p>
                                <select
                                    value={sendTo}
                                    onChange={(e) => setSendTo(e.target.value)}
                                    className="notification-input-field"
                                >
                                    <option value="all">All Users</option>
                                    <option value="customers">Customers</option>
                                    <option value="mechanics">Mechanics</option>
                                </select>
                            </div>

                            <button type="submit" className="card-btn" disabled={loading}>
                                {loading ? "Sending..." : "📢 Send Notification"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
