import React, { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";

function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  
  // Custom accent color picker
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem("custom-accent") || "#7c7cff";
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    localStorage.setItem("custom-accent", accent);
  }, [accent]);

  const resetAccent = () => {
    const defaultAccent = isDark ? "#7c7cff" : "#5b5bff";
    setAccent(defaultAccent);
  };

  return (
    <section className="section">
      <h2>Settings</h2>
      <p>Configure your workspace preferences and personalize your interface.</p>

      <div className="card-grid" style={{ marginTop: "24px" }}>
        <article className="info-card">
          <h3>Appearance</h3>
          <p>Switch between dark and light themes.</p>
          <div style={{ marginTop: "16px" }}>
            <button className="btn btn-primary" onClick={toggleTheme}>
              Toggle to {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </article>

        <article className="info-card">
          <h3>Brand Customization</h3>
          <p>Personalize the accent color across the app.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
            <input 
              type="color" 
              value={accent} 
              onChange={(e) => setAccent(e.target.value)} 
              style={{
                width: "48px",
                height: "48px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "transparent"
              }}
            />
            <span>Choose accent color</span>
          </div>
          <button className="btn btn-secondary" onClick={resetAccent} style={{ marginTop: "12px" }}>
            Reset to Default
          </button>
        </article>

        <article className="info-card">
          <h3>System Info</h3>
          <p>Running Hauzral Technologies Client v1.0.0</p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "16px" }}>
            Database connection: Connected<br />
            Theme source: localStorage
          </p>
        </article>
      </div>
    </section>
  );
}

export default SettingsPage;
