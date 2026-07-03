import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
   const { user } = useAuth();

  // Pre-fill API key if admin signed in via LoginPage (it stored apiKey in user)
  const [adminApiKey, setAdminApiKey] = useState(user?.apiKey || "");
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState({});

  // Auto-load when dashboard mounts with a stored API key
  useEffect(() => {
    if (user?.apiKey) {
      loadProjects(user.apiKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.apiKey]);

  async function loadProjects(keyOverride) {
    const key = keyOverride ?? adminApiKey;
    if (!key.trim()) {
      setMessage("Enter an admin API key first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/projects", {
        headers: { "x-admin-api-key": key },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load admin projects");
      }

      setProjects(data.projects || []);
      setMessage(`Loaded ${data.projects?.length || 0} project${data.projects?.length === 1 ? "" : "s"}.`);
      setUpdates({});
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function updateProject(projectId) {
    const update = updates[projectId] || {};
    const project = projects.find((p) => p.id === projectId);
    const defaultStage = project?.stages?.[0]?.name || "Discovery";

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": adminApiKey,
        },
        body: JSON.stringify({
          stageName: update.stageName || defaultStage,
          status: update.status || "In progress",
          note: update.note || "",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to update project");
      }

      setMessage(`Updated "${data.project?.title || "project"}".`);
      await loadProjects();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update project");
    }
  }

  async function deleteProject(projectId) {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
        headers: { "x-admin-api-key": adminApiKey },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete project");
      }

      setMessage("Project deleted successfully.");
      await loadProjects();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete project");
    }
  }

  return (
    <section className="section">
      <h2>Admin dashboard</h2>
      <p>Review all client projects and advance delivery stages.</p>

      {/* API key input — hidden when already authenticated via login */}
      {!user?.apiKey && (
        <div className="project-card" style={{ marginTop: "24px" }}>
          <h3>Admin access</h3>
          <div className="stack">
            <input
              value={adminApiKey}
              onChange={(e) => setAdminApiKey(e.target.value)}
              placeholder="Admin API key"
              type="password"
              onKeyDown={(e) => e.key === "Enter" && loadProjects()}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => loadProjects()}
              disabled={loading}
            >
              {loading ? "Loading…" : "Load projects"}
            </button>
          </div>
          {message && <p style={{ marginTop: "12px", color: "var(--muted)" }}>{message}</p>}
        </div>
      )}

      {/* Status bar when auto-loaded */}
      {user?.apiKey && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            marginBottom: "8px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span style={{ color: "var(--muted)", fontSize: "0.88rem" }}>{message}</span>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => loadProjects()}
            disabled={loading}
            style={{ fontSize: "0.85rem", padding: "7px 16px" }}
          >
            {loading ? "Refreshing…" : "↻ Refresh"}
          </button>
        </div>
      )}

      {/* Project cards */}
      {projects.length > 0 && (
        <div className="card-grid" style={{ marginTop: "16px" }}>
          {projects.map((project) => {
            const stages = project.stages || [];
            const currentStageName =
              updates[project.id]?.stageName ||
              (stages.find((s) => s.name === project.stage_status)
                ? project.stage_status
                : stages[0]?.name || "Discovery");

            return (
              <article key={project.id} className="project-card">
                {/* Project header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ margin: 0, fontSize: "1rem" }}>{project.title}</h3>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "0.76rem",
                      fontWeight: 600,
                      background: "rgba(56,189,248,0.13)",
                      color: "#38bdf8",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.stage_status}
                  </span>
                </div>

                <p style={{ color: "var(--muted)", fontSize: "0.87rem", margin: "0 0 8px" }}>
                  {project.summary}
                </p>

                {/* Client info */}
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: "0 0 14px" }}>
                  👤 {project.client_name} &nbsp;·&nbsp; {project.client_email}
                  {project.company ? ` · ${project.company}` : ""}
                </p>

                <div className="stack">
                  <select
                    value={currentStageName}
                    onChange={(e) =>
                      setUpdates((prev) => ({
                        ...prev,
                        [project.id]: { ...prev[project.id], stageName: e.target.value },
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {stages.map((stage) => (
                      <option key={stage.name} value={stage.name}>
                        {stage.name} — {stage.status}
                      </option>
                    ))}
                  </select>

                  <input
                    value={updates[project.id]?.note || ""}
                    onChange={(e) =>
                      setUpdates((prev) => ({
                        ...prev,
                        [project.id]: { ...prev[project.id], note: e.target.value },
                      }))
                    }
                    placeholder="Add a note for the client (optional)"
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text)",
                      fontSize: "0.9rem",
                    }}
                  />

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => updateProject(project.id)}
                      style={{ flex: 1, fontSize: "0.87rem", padding: "9px 0" }}
                    >
                      Update stage
                    </button>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      style={{
                        fontSize: "0.87rem",
                        padding: "9px 14px",
                        backgroundColor: "rgba(239,68,68,0.1)",
                        borderColor: "rgba(239,68,68,0.4)",
                        color: "#f87171",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && projects.length === 0 && (adminApiKey || user?.apiKey) && (
        <div
          style={{
            marginTop: "24px",
            padding: "40px",
            textAlign: "center",
            color: "var(--muted)",
            border: "1px dashed var(--border)",
            borderRadius: "16px",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📭</div>
          <p style={{ margin: 0, fontWeight: 600 }}>No projects yet</p>
          <p style={{ margin: "6px 0 0", fontSize: "0.88rem" }}>
            Projects submitted by clients will appear here.
          </p>
        </div>
      )}


</section>
   );
 }