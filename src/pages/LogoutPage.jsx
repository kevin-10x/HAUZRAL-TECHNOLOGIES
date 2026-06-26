import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    logout();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, logout]);

  return (
    <section className="section" style={{ textAlign: "center", padding: "80px 20px" }}>
      <div className="info-card" style={{ maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
        <h2>Logged Out</h2>
        <p>You have been safely logged out of your Hauzral Technologies portal session.</p>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Redirecting to Home in {countdown} seconds...
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/")} style={{ marginTop: "16px" }}>
          Return Home Now
        </button>
      </div>
    </section>
  );
}

export default LogoutPage;
