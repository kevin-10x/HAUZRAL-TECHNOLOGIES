import React, { useState } from "react";

function AdminDashboard() {
  const [adminApiKey, setAdminApiKey] = useState("");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState({});

  async function loadProjects() {
    if (!adminApiKey.trim()) {
      setMessage("Enter an admin API key first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/projects", {
        headers: { "x-admin-api-key": adminApiKey },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load admin projects");
      }

      setProjects(data.projects || []);
      setMessage(`Loaded ${data.projects?.length || 0} projects.`);
      setUpdates({});
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function updateProject(projectId) {
    const update = updates[projectId] || {};

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": adminApiKey,
        },
        body: JSON.stringify({
          stageName: update.stageName || "Discovery",
          status: update.status || "In progress",
          note: update.note || "",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update project");
      }

      setMessage(`Updated ${data.project?.title || "project"}.`);
      await loadProjects();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update project");
    }
  }

  return (
    <section className="section">
      <h2>Admin dashboard</h2>
      <p>Review projects and advance delivery stages from a dedicated dashboard view.</p>

      <div className="project-card" style={{ marginTop: "24px" }}>
        <h3>Admin access</h3>
        <div className="stack">
          <input
            value={adminApiKey}
            onChange={(event) => setAdminApiKey(event.target.value)}
            placeholder="Admin API key"
            type="password"
          />
          <button className="btn btn-primary" type="button" onClick={loadProjects} disabled={loading}>
            {loading ? "Loading..." : "Load projects"}
          </button>
        </div>
        {message ? <p style={{ marginTop: "12px" }}>{message}</p> : null}
      </div>

      {projects.length ? (
        <div className="card-grid" style={{ marginTop: "24px" }}>
          {projects.map((project) => (
            <article key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <p style={{ color: "var(--accent-2)" }}>Current stage: {project.stage_status}</p>
              <div className="stack">
                <select
                  value={updates[project.id]?.stageName || project.stage_status}
                  onChange={(event) =>
                    setUpdates((current) => ({
                      ...current,
                      [project.id]: { ...current[project.id], stageName: event.target.value },
                    }))
                  }
                >
                  {(project.stages || []).map((stage) => (
                    <option key={stage.name} value={stage.name}>
                      {stage.name}
                    </option>
                  ))}
                </select>
                <input
                  value={updates[project.id]?.note || ""}
                  onChange={(event) =>
                    setUpdates((current) => ({
                      ...current,
                      [project.id]: { ...current[project.id], note: event.target.value },
                    }))
                  }
                  placeholder="Update note"
                />
                <button className="btn btn-secondary" type="button" onClick={() => updateProject(project.id)}>
                  Update stage
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default AdminDashboard;
