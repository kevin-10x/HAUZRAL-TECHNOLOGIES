import React from "react";

const services = [
  {
    title: "Brand Strategy",
    text: "Positioning, messaging, and experience frameworks that sharpen your edge.",
  },
  {
    title: "Web Experiences",
    text: "Fast, elegant websites and product journeys built for conversion and trust.",
  },
  {
    title: "Growth Marketing",
    text: "Performance campaigns, analytics, and storytelling that turn attention into revenue.",
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
