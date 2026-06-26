import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("hauzral-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("hauzral-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hauzral-user");
    }
  }, [user]);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("hauzral-user");
    localStorage.removeItem("user-session");
  }

  const isAdmin = user?.role === "admin";
  const isClient = user?.role === "client";
  const isLoggedIn = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isClient, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
