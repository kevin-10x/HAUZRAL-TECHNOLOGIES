import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "./ThemeProvider";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About (Founder)" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/document", label: "CV/Resume" },
  { to: "/client-portal", label: "Client Portal" },
  { to: "/admin", label: "Admin" },
  { to: "/settings", label: "Settings" },
  { to: "/logout", label: "Logout" },
];

function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar" style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">H</span>
          <span>Hauzral Technologies</span>
        </Link>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            className="btn btn-secondary" 
            onClick={toggleTheme} 
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            title="Toggle light/dark theme"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
          
          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)} 
            aria-label="Toggle navigation menu"
            style={{ display: "flex", cursor: "pointer" }}
          >
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none", transition: "transform 0.2s" }}></span>
            <span style={{ opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }}></span>
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none", transition: "transform 0.2s" }}></span>
          </button>
        </div>
      </div>

      <nav 
        className={`nav-links ${menuOpen ? "open" : ""}`} 
        aria-label="Primary navigation"
        style={{ 
          marginTop: menuOpen ? "16px" : "0px",
          transition: "all 0.3s ease" 
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
            style={{ padding: "8px 0" }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;
