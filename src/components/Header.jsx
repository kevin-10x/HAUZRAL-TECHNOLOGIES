import React from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/work", label: "Work" },
  { to: "/contact", label: "Contact" },
  { to: "/client-portal", label: "Client portal" },
  { to: "/admin", label: "Admin" },
];

function Header() {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark">H</span>
        <span>Hauzral Technologies</span>
      </Link>
      <div className="nav-area">
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="auth-actions">
          <Link className="btn btn-secondary btn-small" to="/client-portal">
            Client portal
          </Link>
          <Link className="btn btn-primary btn-small" to="/contact">
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
