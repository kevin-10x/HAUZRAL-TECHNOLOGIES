import React, { useEffect, useState } from "react";

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

  return (
    <section className="section">
      <h2>Client portal</h2>
      <p>Create an account and submit projects from a dedicated portal view.</p>

      <div className="card-grid" style={{ marginTop: "24px" }}>
        <article className="project-card">
          <h3>Client account</h3>
          <form onSubmit={handleSignup} className="stack">
            <input
              value={signupForm.name}
              onChange={(event) => setSignupForm({ ...signupForm, name: event.target.value })}
              placeholder="Full name"
              required
            />
            <input
              value={signupForm.email}
              onChange={(event) => setSignupForm({ ...signupForm, email: event.target.value })}
              placeholder="Email"
              type="email"
              required
            />
            <input
              value={signupForm.company}
              onChange={(event) => setSignupForm({ ...signupForm, company: event.target.value })}
              placeholder="Company"
            />
            <input
              value={signupForm.phone}
              onChange={(event) => setSignupForm({ ...signupForm, phone: event.target.value })}
              placeholder="Phone"
            />
            <select
              value={signupForm.projectType}
              onChange={(event) => setSignupForm({ ...signupForm, projectType: event.target.value })}
            >
              <option>Custom web app</option>
              <option>Marketing site</option>
              <option>Brand system</option>
              <option>Growth sprint</option>
            </select>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create client account"}
            </button>
          </form>
          {signupMessage ? <p style={{ marginTop: "12px" }}>{signupMessage}</p> : null}
        </article>

        <article className="project-card">
          <h3>Project request</h3>
          <form onSubmit={handleProjectSubmit} className="stack">
            <input
              value={projectForm.title}
              onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })}
              placeholder="Project title"
              required
            />
            <textarea
              value={projectForm.summary}
              onChange={(event) => setProjectForm({ ...projectForm, summary: event.target.value })}
              placeholder="Project summary"
              rows="4"
              required
            />
            <input
              value={projectForm.budget}
              onChange={(event) => setProjectForm({ ...projectForm, budget: event.target.value })}
              placeholder="Budget"
            />
            <input
              value={projectForm.timeline}
              onChange={(event) => setProjectForm({ ...projectForm, timeline: event.target.value })}
              placeholder="Timeline"
            />
            <textarea
              value={projectForm.requirements}
              onChange={(event) => setProjectForm({ ...projectForm, requirements: event.target.value })}
              placeholder="Requirements"
              rows="3"
            />
            <button className="btn btn-secondary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit project request"}
            </button>
          </form>
          {projectMessage ? <p style={{ marginTop: "12px" }}>{projectMessage}</p> : null}
        </article>
      </div>

      {projects.length ? (
        <div style={{ marginTop: "24px" }}>
          <h3>Your projects</h3>
          <div className="card-grid">
            {projects.map((project) => (
              <article key={project.id} className="project-card">
                <h4>{project.title}</h4>
                <p>{project.summary}</p>
                <p style={{ color: "var(--accent-2)" }}>Stage: {project.stage_status}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default ClientPortalSection;
