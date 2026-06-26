import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * /auth-callback
 *
 * The server redirects here after a successful Google OAuth exchange.
 * Query params: name, email, picture, role, redirect (optional)
 * This page hydrates AuthContext then forwards the user to their destination.
 */
export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const name    = params.get("name")     || "";
    const email   = params.get("email")    || "";
    const picture = params.get("picture")  || "";
    const role    = params.get("role")     || "client";
    const dest    = params.get("redirect") || (role === "admin" ? "/admin" : "/client-portal");

    if (email) {
      login({ name, email, picture, role });
      navigate(dest, { replace: true });
    } else {
      // Something went wrong — send them to login
      navigate("/login", { replace: true });
    }
  }, [params, login, navigate]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "var(--muted)",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent-2)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ margin: 0, fontSize: "0.9rem" }}>Signing you in…</p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
