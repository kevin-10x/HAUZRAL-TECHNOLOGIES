import React from "react";

const projects = [
  {
    title: "Northstar AI",
    text: "Repositioned a B2B platform with a sharper narrative and flagship website.",
  },
  {
    title: "Orchid Capital",
    text: "Designed a polished investor experience that elevated credibility and trust.",
  },
  {
    title: "Flux Commerce",
    text: "Scaled paid acquisition with a conversion-focused storefront and lifecycle messaging.",
  },
];

function ProjectsSection() {
  return (
    <section className="section" id="work">
      <h2>Selected work</h2>
      <p>Recent launches that turned bold ambitions into measurable momentum.</p>
      <div className="card-grid">
        {projects.map((project) => (
          <article key={project.title} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;
