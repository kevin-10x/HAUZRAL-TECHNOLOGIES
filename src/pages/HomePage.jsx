import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import ProjectsSection from "../components/ProjectsSection";

function HomePage() {
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function checkApi() {
      try {
        const apiBase = import.meta.env.VITE_API_URL || window.location.origin;
        const res = await fetch(new URL("/api/health", apiBase).toString(), {
          signal: AbortSignal.timeout(4000),
        });
        if (!cancelled) setApiConnected(res.ok);
      } catch {
        if (!cancelled) setApiConnected(false);
      }
    }
    checkApi();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <HeroSection />
      {apiConnected && (
        <div style={{ textAlign: "center", padding: "8px", color: "var(--accent)", fontSize: "0.8rem" }}>
          API connected · v2.0
        </div>
      )}
      <ServicesSection />
      <ProjectsSection />
    </>
  );
}

export default HomePage;
