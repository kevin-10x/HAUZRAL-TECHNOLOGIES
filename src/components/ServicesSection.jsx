import React from "react";

const services = [
  {
    title: "Web Development",
    text: "Building fast, modern, responsive, and search-optimized web applications tailored to your business goals.",
  },
  {
    title: "System Development",
    text: "Designing scalable, efficient, and robust backend systems and custom software architectures.",
  },
  {
    title: "AI Development",
    text: "Integrating intelligent solutions, machine learning datasets, and LLM architectures into digital products.",
  },
  {
    title: "Data Science",
    text: "Preparing datasets, building machine learning models, and turning complex data into predictive power.",
  },
  {
    title: "Data Analysis",
    text: "Synthesizing raw operational data into clear, interactive dashboards and strategic insights.",
  },
  {
    title: "Cybersecurity",
    text: "Securing codebases, protecting user authentication portals, and preventing web system vulnerabilities.",
  },
];

function ServicesSection() {
  return (
    <section className="section" id="services">
      <h2>Services</h2>
      <p>We blend strategy, design, and data to help your team build momentum.</p>
      <div className="card-grid">
        {services.map((service) => (
          <article key={service.title} className="project-card">
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
