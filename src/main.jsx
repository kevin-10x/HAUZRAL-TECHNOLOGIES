import React, { useEffect, useState } from "react";
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
          {["Services", "About", "Work", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>
              {item}
            </a>
          ))}
        </nav>
        <div className="auth-actions">
          <a className="btn btn-secondary btn-small" href="/api/auth/signup" onClick={closeMenu}>
            Sign up
          </a>
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
        <p className="eyebrow">Strategy | Design | Growth</p>
        <h1>We build brands that move markets.</h1>
        <p className="hero-text">
          Hauzral Technologies helps ambitious companies turn bold ideas into exceptional
          digital experiences that win attention and accelerate growth.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#contact">
            Book a strategy call
          </a>
          <a className="btn btn-google" href="/api/auth/signup">
            <span className="google-mark" aria-hidden="true">
              G
            </span>
            Sign up with Google
          </a>
          <a className="btn btn-secondary" href="#work">
            See our work
          </a>
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
    </section>
  );
}

function ClientPortalSection() {
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "Custom web app",
  });
  const [client, setClient] = useState(null);
  const [signupMessage, setSignupMessage] = useState("");
  const [projectForm, setProjectForm] = useState({
    title: "",
    summary: "",
    budget: "",
    timeline: "",
    requirements: "",
  });
  const [projectMessage, setProjectMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadProjects(email) {
    try {
      const response = await fetch(`/api/clients/${encodeURIComponent(email)}/projects`);
      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!client?.email) {
      return undefined;
    }

    loadProjects(client.email);
    const timer = window.setInterval(() => {
      loadProjects(client.email);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [client?.email]);

  async function handleSignup(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSignupMessage("");

    try {
      const response = await fetch("/api/clients/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create client account");
      }

      setClient(data.client);
      setSignupMessage(`Welcome ${data.client.name}! Your client portal is ready.`);
      window.dispatchEvent(new Event("project-updated"));
      await loadProjects(data.client.email);
    } catch (error) {
      setSignupMessage(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();
    if (!client?.email) {
      setProjectMessage("Create your client account first to submit a project request.");
      return;
    }

    setIsSubmitting(true);
    setProjectMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientEmail: client.email,
          ...projectForm,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit project request");
      }

      setProjectMessage("Your project request has been submitted successfully.");
      window.dispatchEvent(new Event("project-updated"));
      setProjectForm({
        title: "",
        summary: "",
        budget: "",
        timeline: "",
        requirements: "",
      });
      await loadProjects(client.email);
    } catch (error) {
      setProjectMessage(error instanceof Error ? error.message : "Unable to submit project request");
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeProject = projects[0] || null;

  return (
    <section id="get-started" className="section portal-section">
      <div className="section-heading">
        <p className="eyebrow">Client portal</p>
        <h2>Your project signup and delivery workspace.</h2>
        <p>
          Create your client account, share your project brief, and follow every stage of your
          software delivery journey from one place.
        </p>
      </div>

      <div className="portal-grid">
        <form className="portal-card" onSubmit={handleSignup}>
          <h3>Sign up as a client</h3>
          <p>Tell us who you are and what kind of product you want to build.</p>
          <div className="form-grid">
            <label>
              Full name
              <input
                type="text"
                value={signupForm.name}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={signupForm.email}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Company
              <input
                type="text"
                value={signupForm.company}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, company: event.target.value }))
                }
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                value={signupForm.phone}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </label>
            <label className="full-width">
              Project focus
              <select
                value={signupForm.projectType}
                onChange={(event) =>
                  setSignupForm((current) => ({ ...current, projectType: event.target.value }))
                }
              >
                <option>Custom web app</option>
                <option>Mobile product</option>
                <option>Marketing website</option>
                <option>Internal dashboard</option>
              </select>
            </label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create client account"}
          </button>
          {signupMessage ? <p className="form-message">{signupMessage}</p> : null}
        </form>

        <div className="portal-card portal-dashboard">
          <h3>Client dashboard</h3>
          <p>
            Once your account is created, you can submit a project request and follow the delivery
            flow.
          </p>
          {client ? (
            <div className="dashboard-summary">
              <div>
                <strong>{client.name}</strong>
                <p>{client.email}</p>
              </div>
              <div>
                <strong>{projects.length}</strong>
                <p>active request(s)</p>
              </div>
            </div>
          ) : (
            <div className="dashboard-summary muted-card">
              <p>No account created yet. Sign up to unlock the project tracker.</p>
            </div>
          )}
        </div>
      </div>

      {client ? (
        <div className="portal-grid portal-grid-bottom">
          <form className="portal-card" onSubmit={handleProjectSubmit}>
            <h3>Submit a project request</h3>
            <p>Share your goals so we can kick off the delivery plan.</p>
            <div className="form-grid">
              <label className="full-width">
                Project title
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, title: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="full-width">
                Project brief
                <textarea
                  rows="4"
                  value={projectForm.summary}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, summary: event.target.value }))
                  }
                  required
                />
              </label>
              <label>
                Budget range
                <input
                  type="text"
                  value={projectForm.budget}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, budget: event.target.value }))
                  }
                />
              </label>
              <label>
                Timeline
                <input
                  type="text"
                  value={projectForm.timeline}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, timeline: event.target.value }))
                  }
                />
              </label>
              <label className="full-width">
                Requirements
                <textarea
                  rows="4"
                  value={projectForm.requirements}
                  onChange={(event) =>
                    setProjectForm((current) => ({ ...current, requirements: event.target.value }))
                  }
                />
              </label>
            </div>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit project request"}
            </button>
            {projectMessage ? <p className="form-message">{projectMessage}</p> : null}
          </form>

          <div className="portal-card">
            <h3>Project development tracker</h3>
            <p>Every request moves through discovery, planning, design, development, testing, and deployment.</p>
            {activeProject ? (
              <>
                <div className="project-overview">
                  <h4>{activeProject.title}</h4>
                  <p>{activeProject.summary}</p>
                  <div className="metadata-row">
                    <span>Budget: {activeProject.budget || "Custom"}</span>
                    <span>Timeline: {activeProject.timeline || "To be confirmed"}</span>
                  </div>
                </div>
                <div className="stage-stack">
                  {(activeProject.stages || []).map((stage) => (
                    <div key={stage.name} className="stage-card">
                      <div className="stage-topline">
                        <strong>{stage.name}</strong>
                        <span className={`stage-pill ${stage.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          {stage.status}
                        </span>
                      </div>
                      <p>{stage.description}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="muted-card">Your submitted project requests will appear here with the full delivery tracker.</p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedStage, setSelectedStage] = useState("Discovery");
  const [selectedStatus, setSelectedStatus] = useState("In progress");
  const [adminMessage, setAdminMessage] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadProjects() {
    try {
      const response = await fetch("/api/admin/projects");
      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadProjects();
    const onRefresh = () => loadProjects();
    window.addEventListener("project-updated", onRefresh);
    return () => window.removeEventListener("project-updated", onRefresh);
  }, []);

  useEffect(() => {
    if (!selectedProjectId && projects.length) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  async function handleAdminUpdate(event) {
    event.preventDefault();
    if (!selectedProjectId) {
      return;
    }

    setIsSaving(true);
    setAdminMessage("");

    try {
      const response = await fetch(`/api/admin/projects/${selectedProjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageName: selectedStage,
          status: selectedStatus,
          note: adminNote,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update project progress");
      }

      setAdminMessage(`Updated ${data.project.title} to ${selectedStage} (${selectedStatus}).`);
      setAdminNote("");
      window.dispatchEvent(new Event("project-updated"));
      await loadProjects();
    } catch (error) {
      setAdminMessage(error instanceof Error ? error.message : "Unable to update project progress");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="section admin-section">
      <div className="section-heading">
        <p className="eyebrow">Admin dashboard</p>
        <h2>Review client projects and update delivery progress.</h2>
        <p>
          Every project request from the client side appears here so you can guide delivery and
          keep the client tracker current.
        </p>
      </div>

      <div className="portal-grid">
        <form className="portal-card" onSubmit={handleAdminUpdate}>
          <h3>Update project progress</h3>
          <p>Choose the stage that the client should now see and mark the delivery status.</p>
          <div className="form-grid">
            <label className="full-width">
              Project
              <select
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title} — {project.client_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Delivery stage
              <select value={selectedStage} onChange={(event) => setSelectedStage(event.target.value)}>
                <option>Discovery</option>
                <option>Planning</option>
                <option>Design</option>
                <option>Development</option>
                <option>Testing</option>
                <option>Deployment</option>
              </select>
            </label>
            <label>
              Status
              <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                <option>Queued</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </label>
            <label className="full-width">
              Update note
              <textarea
                rows="3"
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={isSaving}>
            {isSaving ? "Updating..." : "Send update to client"}
          </button>
          {adminMessage ? <p className="form-message">{adminMessage}</p> : null}
        </form>

        <div className="portal-card">
          <h3>Incoming client requests</h3>
          <p>Projects appear here the moment a client submits a request from the portal.</p>
          <div className="stage-stack">
            {projects.length ? (
              projects.map((project) => (
                <div key={project.id} className="stage-card">
                  <div className="stage-topline">
                    <strong>{project.title}</strong>
                    <span className="stage-pill in-progress">{project.stage_status}</span>
                  </div>
                  <p>{project.summary}</p>
                  <div className="metadata-row">
                    <span>{project.client_name}</span>
                    <span>{project.client_email}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="muted-card">No client requests yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLinks() {
  const links = [
    { name: "YouTube", url: "https://www.youtube.com/@HAUZRALTECHNOLOGIES", icon: "▶" },
    { name: "TikTok", url: "https://www.tiktok.com/@codingwithzral", icon: "♪" },
    { name: "X", url: "https://x.com/hauzraltech", icon: "✕" },
    { name: "Instagram", url: "https://www.instagram.com/hauzraladamae/", icon: "◎" },
    { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61589578675674", icon: "f" },
  ];

  return (
    <section className="section social-section" aria-label="Social media links">
      <div className="section-heading">
        <p className="eyebrow">Follow us</p>
        <h2>Connect with Hauzral on social media.</h2>
      </div>
      <div className="social-links">
        {links.map((link) => (
          <a key={link.name} className="social-link" href={link.url} target="_blank" rel="noreferrer">
            <span className="social-icon" aria-hidden="true">
              {link.icon}
            </span>
            <span>{link.name}</span>
          </a>
        ))}
      </div>
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
            Trusted by founders, startups, and established teams across SaaS, fintech, and
            retail.
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
            <h2>Recent launches shaping the next wave of digital growth.</h2>
          </div>
          <div className="card-grid work-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section testimonial-section">
          <div className="section-heading">
            <p className="eyebrow">Testimonials</p>
            <h2>Partners value our speed, clarity, and craftsmanship.</h2>
          </div>
          <blockquote>
            "Hauzral brought our vision to life in a way that felt premium, strategic, and
            instantly effective."
            <footer>- kevin kipkoech, Founder at hauzral technologies</footer>
          </blockquote>
        </section>

        <ClientPortalSection />
        <AdminDashboard />
        <SocialLinks />
      </main>

      <footer id="contact" className="footer">
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
