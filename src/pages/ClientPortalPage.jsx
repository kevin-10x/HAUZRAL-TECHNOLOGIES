import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClientPortalSection from "../components/ClientPortalSection";

export default function ClientPortalPage() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Preserve the destination so the user lands here after signing in
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname, mode: "signin" }}
        replace
      />
    );
  }

  return <ClientPortalSection />;
}
