import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── Google SVG icon ─────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.9 2.3 30.3 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6.1C12.5 13 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4C43.6 36.8 46.5 31 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.5 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.9-4.6l-7.8-6C1 16.4 0 20.1 0 24s1 7.6 2.7 10.7l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7-5.4c-2.2 1.5-5 2.3-8.5 2.3-6.2 0-11.5-3.5-13.5-8.6l-7.8 6.1C6.7 42.6 14.7 48 24 48z" />
    </svg>
  );
}

/* ── Role tab ────────────────────────────────────────────── */
function RoleTab({ role, active, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(role)}
      style={{
        flex: 1,
        padding: "10px 0",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.9rem",
        background: active
          ? "linear-gradient(135deg, var(--accent), var(--accent-2))"
          : "transparent",
        color: active ? "#fff" : "var(--muted)",
        transition: "all 0.2s ease",
      }}
    >
      {role === "client" ? "👤 Client" : "🛡️ Admin"}
    </button>
  );
}

/* ── Main LoginPage component ────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // "signin" | "signup"
  const [mode, setMode] = useState(location.state?.mode ?? "signin");
  const [role, setRole] = useState("client");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectAfterAuth = location.state?.from ?? (role === "admin" ? "/admin" : "/client-portal");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  /* Simulate credential sign-in (replace with real API call as needed) */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // --- Admin: validate via API key header approach ---
      if (role === "admin") {
        const res = await fetch("/api/admin/projects", {
          headers: { "x-admin-api-key": form.password },
        });
        if (!res.ok) {
          throw new Error("Invalid admin credentials.");
        }
        login({ email: form.email, role: "admin", name: "Admin" });
        navigate(redirectAfterAuth, { replace: true });
        return;
      }

      // --- Client: look up projects by email to verify the account exists ---
      const res = await fetch(`/api/clients/${encodeURIComponent(form.email)}/projects`);
      if (!res.ok) {
        throw new Error("No account found with that email. Create one below.");
      }
      login({ email: form.email, role: "client", name: form.email.split("@")[0] });
      navigate(redirectAfterAuth, { replace: true });
    } catch (err) {
      setError(err.message ?? "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* Google OAuth redirect */
  function handleGoogleAuth() {
    const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/google";
    window.location.href = endpoint;
  }

  const isSignup = mode === "signup";

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
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "36px 32px",
          position: "relative",
        }}
      >
        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link
            to="/"
            className="brand"
            style={{ justifyContent: "center", marginBottom: "8px" }}
          >
            <span className="brand-mark">H</span>
            <span style={{ fontSize: "1.1rem" }}>Hauzral Technologies</span>
          </Link>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "6px 0 0" }}>
            {isSignup ? "Create your client account" : "Welcome back"}
          </p>
        </div>

        {/* Sign-in / Sign-up tab pills */}
        <div
          style={{
            display: "flex",
            background: "var(--surface-strong)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "24px",
            gap: "4px",
          }}
        >
          <RoleTabPill label="Sign in" active={!isSignup} onClick={() => setMode("signin")} />
          <RoleTabPill label="Sign up" active={isSignup} onClick={() => setMode("signup")} />
        </div>

        {/* Role selector — only show on sign-in */}
        {!isSignup && (
          <div
            style={{
              display: "flex",
              background: "var(--surface-strong)",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "24px",
              gap: "4px",
            }}
          >
            <RoleTab role="client" active={role === "client"} onClick={setRole} />
            <RoleTab role="admin" active={role === "admin"} onClick={setRole} />
          </div>
        )}

        {/* Google button */}
        <button
          type="button"
          className="btn btn-google"
          onClick={handleGoogleAuth}
          style={{
            width: "100%",
            marginBottom: "20px",
            gap: "10px",
            justifyContent: "center",
            padding: "11px 18px",
            borderRadius: "12px",
          }}
        >
          <GoogleIcon />
          {isSignup ? "Sign up with Google" : "Continue with Google"}
        </button>

        {/* If signup mode, only Google is allowed */}
        {isSignup ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--muted)",
              fontSize: "0.85rem",
              margin: "8px 0 16px",
            }}
          >
            Account creation is only available via Google.
            <br />
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                padding: 0,
                fontWeight: 600,
              }}
            >
              Sign in
            </button>
          </div>
        ) : (
          <>
            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
              <span style={{ color: "var(--muted)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                or sign in with email
              </span>
              <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <AuthInput
                  label={role === "admin" ? "Admin email" : "Email address / phone"}
                  name="email"
                  type={role === "admin" ? "email" : "text"}
                  placeholder={
                    role === "admin" ? "admin@hauzral.com" : "you@example.com or +254700…"
                  }
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                <AuthInput
                  label={role === "admin" ? "Admin API key" : "Password"}
                  name="password"
                  type="password"
                  placeholder={role === "admin" ? "Enter admin API key" : "Enter your password"}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={role === "admin" ? "off" : "current-password"}
                />

                {error && (
                  <p
                    role="alert"
                    style={{
                      color: "var(--accent-3)",
                      fontSize: "0.85rem",
                      margin: 0,
                      padding: "10px 14px",
                      background: "rgba(255, 64, 129, 0.1)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255, 64, 129, 0.25)",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: "100%", borderRadius: "12px", padding: "13px" }}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </div>
            </form>

            <p
              style={{
                textAlign: "center",
                color: "var(--muted)",
                fontSize: "0.85rem",
                marginTop: "20px",
                marginBottom: 0,
              }}
            >
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  cursor: "pointer",
                  padding: 0,
                  fontWeight: 600,
                }}
              >
                Create account
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Small helper sub-components ─────────────────────────── */

function RoleTabPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "9px 0",
        border: "none",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "0.9rem",
        background: active ? "var(--surface)" : "transparent",
        color: active ? "var(--text)" : "var(--muted)",
        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.14)" : "none",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function AuthInput({ label, name, type, placeholder, value, onChange, autoComplete }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: "var(--muted)" }}>
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: "10px",
          border: "1px solid var(--border)",
          background: "rgba(255,255,255,0.04)",
          color: "var(--text)",
          fontSize: "0.95rem",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(45,212,191,0.65)";
          e.target.style.boxShadow = "0 0 0 3px rgba(45,212,191,0.18)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "";
          e.target.style.boxShadow = "";
        }}
      />
    </label>
  );
}
