import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

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

const projects = [
  {
    repo: "kevin-10x/HAUZRALADAMAE",
    title: "HAUZRALADAMAE",
    visibility: "Public",
    language: "HTML",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on Mar 24",
    text: "A public web project connected to the Hauzral brand and digital agency presence.",
    url: "https://github.com/kevin-10x/HAUZRALADAMAE",
  },
  {
    repo: "kevin-10x/portfolio-2-flask",
    title: "portfolio-2-flask",
    visibility: "Public",
    language: "HTML",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated 20 hours ago",
    text: "A portfolio implementation that uses Flask to serve a personal web presence.",
    url: "https://github.com/kevin-10x/portfolio-2-flask",
  },
  {
    repo: "kevin-10x/KENYA-HIGHSCHOOL-MANAGEMENT-SYSTEM",
    title: "KENYA-HIGHSCHOOL-MANAGEMENT-SYSTEM",
    visibility: "Public",
    language: "TypeScript",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 11",
    text: "A school operations platform for managing academic and administrative workflows.",
    url: "https://github.com/kevin-10x/KENYA-HIGHSCHOOL-MANAGEMENT-SYSTEM",
  },
  {
    repo: "kevin-10x/FINTECH-START-UP",
    title: "FINTECH-START-UP",
    visibility: "Public",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 23",
    text: "A strong FinTech and economy innovation set shaped from idea list toward startup-grade systems.",
    url: "https://github.com/kevin-10x/FINTECH-START-UP",
  },
  {
    repo: "kevin-10x/Agri-food",
    title: "Agri-food",
    visibility: "Public",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 23",
    text: "A food and agriculture technology project focused on practical market systems.",
    url: "https://github.com/kevin-10x/Agri-food",
  },
  {
    repo: "kevin-10x/DELIVERY-SERVICES--ZRAL",
    title: "DELIVERY-SERVICES--ZRAL",
    visibility: "Public",
    language: "JavaScript",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on Apr 15",
    text: "A delivery services concept for logistics, ordering, and local fulfillment.",
    url: "https://github.com/kevin-10x/DELIVERY-SERVICES--ZRAL",
  },
  {
    repo: "kevin-10x/swahili-translator",
    title: "swahili-translator",
    visibility: "Public",
    language: "Python",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated yesterday",
    text: "A language tool focused on Swahili translation and accessibility.",
    url: "https://github.com/kevin-10x/swahili-translator",
  },
  {
    repo: "kevin-10x/portfolio_react",
    title: "portfolio_react",
    visibility: "Public",
    language: "CSS",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated yesterday",
    text: "A React portfolio project for presenting skills, projects, and personal brand work.",
    url: "https://github.com/kevin-10x/portfolio_react",
  },
  {
    repo: "kevin-10x/Loan_approval_project",
    title: "Loan_approval_project",
    visibility: "Public",
    language: "Python",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated yesterday",
    text: "A loan approval system exploring decision support and financial workflows.",
    url: "https://github.com/kevin-10x/Loan_approval_project",
  },
  {
    repo: "kevin-10x/DIGITAL-GOVERNANCE-STACK",
    title: "DIGITAL-GOVERNANCE-STACK",
    visibility: "Public",
    language: "Concept",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 24",
    text: "A complete digital governance stack from transparency to participation to full national operating systems.",
    url: "https://github.com/kevin-10x/DIGITAL-GOVERNANCE-STACK",
  },
  {
    repo: "kevin-10x/AI-SMART-TRANSPORT-SYSTEM",
    title: "AI-SMART-TRANSPORT-SYSTEM",
    visibility: "Public",
    language: "Concept",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 23",
    text: "AI-powered infrastructure for city movement, goods delivery, and real-time route planning.",
    url: "https://github.com/kevin-10x/AI-SMART-TRANSPORT-SYSTEM",
  },
  {
    repo: "kevin-10x/BUSSINESS-STOCK-CONTROL",
    title: "BUSSINESS-STOCK-CONTROL",
    visibility: "Public",
    language: "Business systems",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 12",
    text: "A stock management project for business inventory and operational control.",
    url: "https://github.com/kevin-10x/BUSSINESS-STOCK-CONTROL",
  },
  {
    repo: "kevin-10x/STOCK-CONTROL",
    title: "STOCK-CONTROL",
    visibility: "Public",
    language: "Business systems",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 12",
    text: "An inventory control project for tracking stock, movement, and business records.",
    url: "https://github.com/kevin-10x/STOCK-CONTROL",
  },
  {
    repo: "kevin-10x/SHULE-MANAGEMENT-SYSTEM",
    title: "SHULE-MANAGEMENT-SYSTEM",
    visibility: "Public",
    language: "Education systems",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 11",
    text: "A school management system for organizing core institution workflows.",
    url: "https://github.com/kevin-10x/SHULE-MANAGEMENT-SYSTEM",
  },
  {
    repo: "kevin-10x/SHULETEC",
    title: "SHULETEC",
    visibility: "Public",
    language: "Education systems",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 11",
    text: "An education technology project connected to digital school operations.",
    url: "https://github.com/kevin-10x/SHULETEC",
  },
  {
    repo: "kevin-10x/HAUZRAL-TECHNOLOGIES",
    title: "HAUZRAL-TECHNOLOGIES",
    visibility: "Public",
    language: "Company site",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on May 9",
    text: "A Hauzral brand project for presenting technology services and digital products.",
    url: "https://github.com/kevin-10x/HAUZRAL-TECHNOLOGIES",
  },
  {
    repo: "kevin-10x/advertalgory",
    title: "advertalgory",
    visibility: "Public",
    language: "Advertising tech",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on Apr 22",
    text: "An advertising technology concept for campaign systems and market visibility.",
    url: "https://github.com/kevin-10x/advertalgory",
  },
  {
    repo: "kevin-10x/advert-algory",
    title: "advert-algory",
    visibility: "Public",
    language: "Advertising tech",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on Apr 22",
    text: "A companion advertising technology repository exploring a related product direction.",
    url: "https://github.com/kevin-10x/advert-algory",
  },
  {
    repo: "kevin-10x/kenyacoin",
    title: "kenyacoin",
    visibility: "Public",
    language: "FinTech",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on Apr 22",
    text: "A digital currency and finance concept built around Kenyan market ideas.",
    url: "https://github.com/kevin-10x/kenyacoin",
  },
  {
    repo: "kevin-10x/sokosmartlinkke",
    title: "sokosmartlinkke",
    visibility: "Public",
    language: "Commerce",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on Apr 22",
    text: "A marketplace and commerce project for connecting local sellers and buyers.",
    url: "https://github.com/kevin-10x/sokosmartlinkke",
  },
  {
    repo: "kevin-10x/soko-mtaani",
    title: "soko-mtaani",
    visibility: "Public",
    language: "Commerce",
    stars: 0,
    forks: 0,
    issues: 0,
    watchers: 0,
    updated: "Updated on Apr 15",
    text: "A local commerce project focused on neighborhood-level trade and access.",
    url: "https://github.com/kevin-10x/soko-mtaani",
  },
];

const featuredProjects = projects.slice(0, 6);
const projectLanguages = ["All", ...new Set(projects.map((project) => project.language))];

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="topbar">
      <a className="brand" href="#home" onClick={closeMenu}>
        <span className="brand-mark">H</span>
        <span>Hauzral Technologies</span>
      </a>
      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`nav-area${isOpen ? " open" : ""}`}>
        <nav className="nav-links" aria-label="Primary navigation">
          {["Services", "About", "Work", "Profile", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>
              {item}
            </a>
          ))}
        </nav>
        <div className="auth-actions">
          <a className="btn btn-secondary btn-small" href="#signin" onClick={closeMenu}>
            Sign in
          </a>
          <a className="btn btn-primary btn-small" href="#get-started" onClick={closeMenu}>
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Kevin Kipkoech | Hauzral Technologies</p>
        <h1>Building practical technology for business, schools, finance, and public systems.</h1>
        <p className="hero-text">
          Hauzral Technologies is a product-minded studio showcasing Kevin's portfolio of
          web apps, education platforms, FinTech ideas, commerce tools, and AI infrastructure
          concepts.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#get-started">
            Get started
          </a>
          <a className="btn btn-secondary" href="/kipkoechkevin.pdf" target="_blank" rel="noreferrer">
            View CV
          </a>
          <a className="btn btn-google" href="/api/auth/google">
            <span className="google-mark" aria-hidden="true">
              G
            </span>
            Sign in with Google
          </a>
          <a className="btn btn-secondary" href="#work">
            See our work
          </a>
        </div>
        <ul className="hero-stats">
          <li>
            <strong>20+</strong>
            <span>public projects</span>
          </li>
          <li>
            <strong>7</strong>
            <span>product domains</span>
          </li>
          <li>
            <strong>Full-stack</strong>
            <span>builder profile</span>
          </li>
        </ul>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="panel-card main-panel">
          <div className="panel-dot" />
          <h3>Portfolio Operating Map</h3>
          <p>Education, FinTech, logistics, agriculture, commerce, language, and governance systems.</p>
          <div className="mini-bars">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="panel-card floating-card">
          <p>Public repositories</p>
          <strong>kevin-10x</strong>
        </div>
      </div>
    </section>
  );
}

function AuthSection() {
  return (
    <section id="get-started" className="section auth-section">
      <div className="section-heading">
        <p className="eyebrow">Start here</p>
        <h2>Get started with Hauzral in minutes.</h2>
        <p>
          Create an account to save your project brief, review proposals, and track launch
          milestones from one workspace.
        </p>
      </div>

      <div className="auth-grid">
        <article className="auth-card">
          <h3>New to Hauzral?</h3>
          <p>Start a workspace for your brand and tell us what you want to build.</p>
          <a className="btn btn-primary" href="#contact">
            Get started
          </a>
        </article>

        <article id="signin" className="auth-card">
          <h3>Already have an account?</h3>
          <p>Sign in to continue your strategy brief or review your project dashboard.</p>
          <div className="stacked-actions">
            <a className="btn btn-google" href="/api/auth/google">
              <span className="google-mark" aria-hidden="true">
                G
              </span>
              Continue with Google
            </a>
            <a className="btn btn-secondary" href="/api/auth/signin">
              Sign in
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function ProjectExplorer() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesLanguage = language === "All" || project.language === language;
      const searchable = `${project.title} ${project.repo} ${project.text} ${project.language}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);

      return matchesLanguage && matchesQuery;
    });
  }, [language, query]);

  return (
    <section className="section project-catalog">
      <div className="section-heading">
        <p className="eyebrow">Repository Catalog</p>
        <h2>A broader product set across software, civic tech, commerce, and AI systems.</h2>
      </div>

      <div className="project-tools" aria-label="Project filters">
        <label className="search-field">
          <span>Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by repo, product, or domain"
          />
        </label>

        <div className="filter-group" aria-label="Filter by language or category">
          {projectLanguages.map((item) => (
            <button
              className={item === language ? "filter-chip active" : "filter-chip"}
              type="button"
              key={item}
              onClick={() => setLanguage(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="result-count">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      <div className="catalog-grid">
        {filteredProjects.map((project) => (
          <a className="catalog-item" href={project.url} target="_blank" rel="noreferrer" key={project.title}>
            <span>
              {project.visibility} | {project.language}
            </span>
            <strong>{project.title}</strong>
            <small>{project.updated}</small>
          </a>
        ))}
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [notice, setNotice] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setNotice("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not send the message.");
      }

      setStatus("success");
      setNotice(result.message || "Message sent. Kevin will follow up.");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Could not send the message.");
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h2>Start a conversation about a project, role, or collaboration.</h2>
        <p>
          Send a short brief and the backend will receive it through the existing Express API.
        </p>
      </div>

      <form className="contact-form" onSubmit={submitForm}>
        <label>
          <span>Name</span>
          <input name="name" value={form.name} onChange={updateField} required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label className="full-field">
          <span>Message</span>
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={updateField}
            required
          />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send message"}
          </button>
          <a className="btn btn-secondary" href="mailto:hello@hauzraltech.com">
            Email directly
          </a>
        </div>
        {notice ? <p className={`form-notice ${status}`}>{notice}</p> : null}
      </form>
    </section>
  );
}

function App() {
  return (
    <div className="page-shell">
      <Header />

      <main id="home">
        <Hero />

        <section className="trusted-bar">
          <p>
            A portfolio built around real-world Kenyan and African technology needs: schools,
            markets, finance, logistics, governance, and language.
          </p>
        </section>

        <section id="services" className="section">
          <div className="section-heading">
            <p className="eyebrow">Services</p>
            <h2>Everything needed to make your brand unforgettable.</h2>
          </div>
          <div className="card-grid">
            {services.map((service) => (
              <article className="info-card" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section split-section">
          <div>
            <p className="eyebrow">Why Hauzral</p>
            <h2>We fuse strategic clarity with a premium digital feel.</h2>
            <p>
              Our team blends product thinking, visual craft, and business acumen to create
              work that feels both beautiful and commercially powerful.
            </p>
          </div>
          <div className="highlight-box">
            <h3>Built for momentum</h3>
            <ul>
              <li>Insight-led creative direction</li>
              <li>Conversion-first UX and UI</li>
              <li>Launch support and optimization</li>
            </ul>
          </div>
        </section>

        <section id="work" className="section">
          <div className="section-heading">
            <p className="eyebrow">Selected Work</p>
            <h2>Projects from the Kevin Kipkoech public portfolio.</h2>
          </div>
          <div className="card-grid work-grid">
            {featuredProjects.map((project) => (
              <article className="project-card" key={project.title}>
                <span className="project-stack">
                  {project.visibility} | {project.language}
                </span>
                <h3>{project.title}</h3>
                <p className="repo-name">{project.repo}</p>
                <p>{project.text}</p>
                <ul className="project-meta">
                  <li>{project.stars} stars</li>
                  <li>{project.forks} forks</li>
                  <li>{project.issues} issues</li>
                  <li>{project.watchers} watchers</li>
                </ul>
                <p className="project-updated">{project.updated}</p>
                <a href={project.url} target="_blank" rel="noreferrer">
                  View repository
                </a>
              </article>
            ))}
          </div>
        </section>

        <ProjectExplorer />

        <section id="profile" className="section split-section profile-section">
          <div>
            <p className="eyebrow">Profile</p>
            <h2>Kevin Kipkoech: founder-builder behind Hauzral's project portfolio.</h2>
            <p>
              The portfolio shows a strong bias toward systems that solve practical problems:
              school management, stock control, local commerce, FinTech tools, transport
              intelligence, translation, and governance infrastructure.
            </p>
          </div>
          <div className="highlight-box">
            <h3>CV and links</h3>
            <p>
              The uploaded PDF has been added as a downloadable CV asset for visitors and
              collaborators.
            </p>
            <div className="stacked-actions">
              <a className="btn btn-primary" href="/kipkoechkevin.pdf" target="_blank" rel="noreferrer">
                View Kevin's CV
              </a>
              <a className="btn btn-secondary" href="https://github.com/kevin-10x" target="_blank" rel="noreferrer">
                GitHub profile
              </a>
            </div>
          </div>
          <figure className="founder-card">
            <img src="/founder-kevin.png" alt="Kevin Kipkoech, founder of Hauzral Technologies" />
            <figcaption>
              <strong>Kevin Kipkoech</strong>
              <span>Founder, Hauzral Technologies</span>
            </figcaption>
          </figure>
        </section>

        <section className="section testimonial-section">
          <div className="section-heading">
            <p className="eyebrow">Testimonials</p>
            <h2>Partners value our speed, clarity, and craftsmanship.</h2>
          </div>
          <blockquote>
            "Hauzral brought our vision to life in a way that felt premium, strategic, and
            instantly effective."
            <footer>- Maya Chen, Founder at Northstar AI</footer>
          </blockquote>
        </section>

        <AuthSection />

        <ContactForm />
      </main>

      <footer className="footer">
        <div>
          <p className="eyebrow">Ready to grow?</p>
          <h2>Let's build something remarkable together.</h2>
        </div>
        <a className="btn btn-primary" href="mailto:hello@hauzraltech.com">
          hello@hauzraltech.com
        </a>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
