import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./styles.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import WorkPage from "./pages/WorkPage";
import ContactPage from "./pages/ContactPage";
import ClientPortalPage from "./pages/ClientPortalPage";
import AdminPage from "./pages/AdminPage";
import SettingsPage from "./pages/SettingsPage";
import DocumentPage from "./pages/DocumentPage";
import LogoutPage from "./pages/LogoutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import AIWidget from "./components/Widget.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="page-shell">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/client-portal" element={<ClientPortalPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/document" element={<DocumentPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth-callback" element={<AuthCallbackPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
              <Route
                path="*"
                element={
                  <section className="section">
                    <h2>Page not found</h2>
                    <p>The requested page could not be found.</p>
                    <Link className="btn btn-primary" to="/">
                      Back home
                    </Link>
                  </section>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
        {/* Global floating AI widget — rendered outside page-shell so it's always on top */}
        <AIWidget />
      </ThemeProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
