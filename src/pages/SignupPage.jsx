import React from "react";
import { Link, useNavigate } from "react-router-dom";

/* Google SVG icon */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.9 2.3 30.3 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6.1C12.5 13 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4C43.6 36.8 46.5 31 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.9-4.6l-7.8-6C1 16.4 0 20.1 0 24s1 7.6 2.7 10.7l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7-5.4c-2.2 1.5-5 2.3-8.5 2.3-6.2 0-11.5-3.5-13.5-8.6l-7.8 6.1C6.7 42.6 14.7 48 24 48z" />
    </svg>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();

  function handleGoogleSignup() {
    window.location.href = "/api/auth/signup";
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        className="info-card"
        style={{ width: "100%", maxWidth: "420px", padding: "40px 32px", textAlign: "center" }}
      >
        {/* Brand */}
        <Link
          to="/"
          className="brand"
          style={{ justifyContent: "center", marginBottom: "6px" }}
        >
          <span className="brand-mark">H</span>
          <span style={{ fontSize: "1.1rem" }}>Hauzral Technologies</span>
        </Link>

        <h2 style={{ margin: "20px 0 8px", fontSize: "1.6rem" }}>Create your account</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "32px" }}>
          Join the Hauzral client portal to track your projects and collaborate.
        </p>

        {/* Perks */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 32px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            textAlign: "left",
          }}
        >
          {[
            "📊 Real-time project progress tracking",
            "💬 Direct communication with our team",
            "📁 Access to project files and documents",
            "🔔 Notifications on milestone updates",
          ].map((perk) => (
            <li
              key={perk}
              style={{
                padding: "10px 14px",
                background: "rgba(45,212,191,0.07)",
                border: "1px solid rgba(45,212,191,0.2)",
                borderRadius: "10px",
                fontSize: "0.9rem",
                color: "var(--text)",
              }}
            >
              {perk}
            </li>
          ))}
        </ul>

        {/* Google sign-up — the only sign-up method */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="btn btn-google"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          <GoogleIcon />
          Sign up with Google
        </button>

        <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "14px", lineHeight: 1.5 }}>
          By continuing, you agree to Hauzral's Terms of Service and Privacy Policy.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "20px 0" }} />

        <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: 0 }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login", { state: { mode: "signin" } })}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              padding: 0,
              fontWeight: 600,
              fontSize: "inherit",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
