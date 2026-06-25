import React from "react";
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <section className="section">
      <h2>Contact</h2>
      <p>Tell us what you are building, where you want to go next, and how quickly you need to move.</p>
      <div className="card-grid" style={{ marginTop: "24px" }}>
        <article className="project-card">
          <h3>Start a conversation</h3>
          <p>hello@hauzraltech.com</p>
          <p>+254 700 000 000</p>
        </article>
        <article className="project-card">
          <h3>Need a portal?</h3>
          <p>Clients can access project updates and submissions from the dedicated portal.</p>
          <Link className="btn btn-primary" to="/client-portal">
            Open client portal
          </Link>
        </article>
      </div>
    </section>
  );
}

export default ContactPage;
