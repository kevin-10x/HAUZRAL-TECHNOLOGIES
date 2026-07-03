import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "../context/AuthContext";

const publicNavItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/document", label: "CV/Resume" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="topbar" style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">H</span>
          <span>Hauzral Technologies</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
            title="Toggle light/dark theme"
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Auth buttons — hidden on mobile (shown in expanded menu) */}
          <div className="header-auth-desktop">
            {isLoggedIn ? (
              <>
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                    padding: "0 4px",
                    maxWidth: "130px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.name || user.email}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleLogout}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

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
        style={{ marginTop: menuOpen ? "16px" : "0px", transition: "all 0.3s ease" }}
      >
        {publicNavItems.map((item) => (
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

        {/* Authenticated portal links */}
        {isLoggedIn && (
          <NavLink
            to="/client-portal"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
            style={{ padding: "8px 0" }}
          >
            Client Portal
          </NavLink>
        )}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
            style={{ padding: "8px 0" }}
          >
            Admin
          </NavLink>
        )}
        {isLoggedIn && (
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
            style={{ padding: "8px 0" }}
          >
            Settings
          </NavLink>
        )}

        {/* Mobile-only auth buttons */}
        <div className="header-auth-mobile" style={{ display: "flex", gap: "10px", paddingTop: "8px", flexWrap: "wrap" }}>
          {isLoggedIn ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{ fontSize: "0.9rem" }}
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-secondary"
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: "0.9rem" }}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: "0.9rem" }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
