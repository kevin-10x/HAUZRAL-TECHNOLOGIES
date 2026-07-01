import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ClientPortalSection from "../components/ClientPortalSection";
import AIAssistant from "../components/AIAssistant"; // 1. Added import

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

  // 2. Wrap them together so they display correctly on the dashboard
  return (
    <div>
      <ClientPortalSection />
      <AIAssistant />
    </div>
  );
}