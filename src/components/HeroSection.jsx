import React from "react";
import { Link } from "react-router-dom";
import AIAssistant from "../components/AIAssistant"; // 1. Added import

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Strategy | Design | Growth</p>
        <h1>We build brands that move markets.</h1>
        <p className="hero-text">
          Hauzral Technologies helps ambitious companies turn bold ideas into exceptional digital
          experiences that win attention and accelerate growth.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/contact">
            Book a strategy call
          </Link>
          <Link className="btn btn-secondary" to="/services">
            Explore services
          </Link>
          <Link className="btn btn-google" to="/client-portal">
            Open client portal
          </Link>
        </div>
        <ul className="hero-stats">
          <li>
            <strong>120+</strong>
            <span>launches</span>
          </li>
          <li>
            <strong>98%</strong>
            <span>client retention</span>
          </li>
          <li>
            <strong>4.9/5</strong>
            <span>average rating</span>
          </li>
        </ul>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="panel-card main-panel">
          <div className="panel-dot" />
          <h3>Digital Momentum Studio</h3>
          <p>Research-led design and growth systems for modern brands.</p>
          <div className="mini-bars">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="panel-card floating-card">
          <p>ROI-focused campaigns</p>
          <strong>+320% uplift</strong>
        </div>
      </div>

      {/* 2. Added Homepage AI Assistant Widget Wrapper */}
      <div className="homepage-ai-widget" style={{ width: "100%", gridColumn: "1 / -1", marginTop: "40px" }}>
        <AIAssistant />
      </div>
    </section>
  );
}

export default HeroSection;