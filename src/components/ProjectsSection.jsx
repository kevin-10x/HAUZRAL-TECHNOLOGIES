import React from "react";

const projects = [
  {
    title: "Full-Stack Web Application Development",
    text: "Developed responsive and scalable web applications using React.js, Node.js, Express.js, and MySQL databases, working on frontend and backend functionalities including authentication systems, API integration, and database management.",
  },
  {
    title: "Backend API Development",
    text: "Designed and implemented backend services and RESTful APIs using Express.js and Node.js. Focused on optimizing database queries, improving performance, and ensuring secure communication between systems.",
  },
  {
    title: "AI Data Labeling Project",
    text: "Participated in AI dataset annotation projects where he categorized, labeled, and validated datasets used for machine learning training, contributing to improving data quality and supporting AI model performance.",
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
