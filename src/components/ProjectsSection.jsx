import React from "react";

const projects = [
  {
    title: "Hauzral Technologies",
    text: "Main growth-focused company website and digital marketing hub for the broader HAUZRAL brand and service ecosystem.",
    live: "https://hauzral-technologies.vercel.app/",
    repo: "https://github.com/kevin-10x/HAUZRAL-TECHNOLOGIES",
  },
  {
    title: "Hauzral Academy",
    text: "An education-first web platform designed for learning experiences, course presentation, and digital knowledge products.",
    live: "https://hauzral-academy.vercel.app/",
    repo: "https://github.com/kevin-10x/Hauzral-Academy",
  },
  {
    title: "Future Teacher",
    text: "A learning and community website built around modern education tools and teacher-centered digital experiences.",
    live: "https://future-teacher-zeta.vercel.app/",
    repo: "https://github.com/kevin-10x/future-teacher",
  },
  {
    title: "Hauzral Platform",
    text: "A platform-style service website exploring digital product architecture, business systems, and world-class product storytelling.",
    live: "https://hauzral-platform.vercel.app/",
    repo: "https://github.com/kevin-10x/hauzral-platform",
  },
  {
    title: "Portfolio React",
    text: "A portfolio website built to present professional work, strengths, and product/brand case studies in a polished format.",
    live: "https://portfolio-react-steel-one.vercel.app/",
    repo: "https://github.com/kevin-10x/portfolio_react",
  },
  {
    title: "Logistics Web",
    text: "A service website focused on route systems, operational execution, and modern logistics brand positioning.",
    live: "https://logistics-web-alpha.vercel.app/",
    repo: "https://github.com/kevin-10x/logistics",
  },
  {
    title: "Phamarcy POS",
    text: "A pharmacy and point-of-sale web application concept for streamlined healthcare retail and operational workflows.",
    live: "https://phamarcy-pos.kipkoechkev6.workers.dev/",
    repo: "https://github.com/kevin-10x/phamarcy-pos",
  },
  {
    title: "Pharmacare",
    text: "A healthcare service platform exploring patient support, digital trust, and modern care service presentation.",
    live: "https://pharmacare.kipkoechkev6.workers.dev/",
    repo: "https://github.com/kevin-10x/Phamacare",
  },
  {
    title: "Video Showcase",
    text: "A media and content showcase site focused on video-driven storytelling and digital brand visibility.",
    live: "https://video.kipkoechkev6.workers.dev/",
    repo: "https://github.com/kevin-10x/video",
  },
  {
    title: "Law AI",
    text: "A legal-tech style concept that blends digital trust, service clarity, and AI-enabled business workflows.",
    live: "https://lawconsultant.kipkoechkev6.workers.dev/",
    repo: "https://github.com/kevin-10x/lawAI",
  },
];

function ProjectsSection() {
  return (
    <section className="section" id="work">
      <h2>Selected work</h2>
      <p>Live websites and continuing builds across education, logistics, healthcare, media, and digital services.</p>
      <div className="card-grid">
        {projects.map((project) => (
          <article key={project.title} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.text}</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ fontSize: "0.85rem", textDecoration: "none" }}
              >
                Live preview
              </a>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: "0.85rem", textDecoration: "none" }}
              >
                Repository
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;
