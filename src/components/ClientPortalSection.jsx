import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

/* ── Stage status pill ───────────────────────────────────── */
const STAGE_META = {
  Completed:   { color: "#34d399", bg: "rgba(52,211,153,0.13)", icon: "✅" },
  "In progress": { color: "#38bdf8", bg: "rgba(56,189,248,0.13)", icon: "🔄" },
  Queued:      { color: "var(--muted)", bg: "rgba(255,255,255,0.05)", icon: "⏳" },
};

function StagePill({ status }) {
  const meta = STAGE_META[status] ?? STAGE_META["Queued"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "0.76rem",
        fontWeight: 600,
        color: meta.color,
        background: meta.bg,
        border: `1px solid ${meta.color}33`,
        whiteSpace: "nowrap",
      }}
    >
      {meta.icon} {status}
    </span>
  );
}

/* ── Progress bar across the top of a project card ──────── */
function StageProgressBar({ stages }) {
  const total = stages.length;
  const completed = stages.filter((s) => s.status === "Completed").length;
  const inProgress = stages.findIndex((s) => s.status === "In progress");
  const pct = total ? Math.round(((completed + (inProgress !== -1 ? 0.5 : 0)) / total) * 100) : 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.8rem",
          color: "var(--muted)",
          marginBottom: "6px",
        }}
      >
        <span>Development progress</span>
        <span style={{ color: "var(--accent-2)", fontWeight: 600 }}>{pct}%</span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "999px",
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

/* ── Individual stage row ────────────────────────────────── */
function StageRow({ stage, index }) {
  const isCompleted = stage.status === "Completed";
  const isActive = stage.status === "In progress";

  return (
    <div
      style={{
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
        padding: "12px 14px",
        borderRadius: "12px",
        background: isActive
          ? "rgba(56,189,248,0.07)"
          : isCompleted
          ? "rgba(52,211,153,0.05)"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${
          isActive
            ? "rgba(56,189,248,0.22)"
            : isCompleted
            ? "rgba(52,211,153,0.18)"
            : "var(--border)"
        }`,
        transition: "all 0.2s ease",
      }}
    >
      {/* Step number / check */}
      <div
        style={{
          flexShrink: 0,
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          fontSize: "0.8rem",
          fontWeight: 700,
          background: isCompleted
            ? "linear-gradient(135deg,#34d399,#059669)"
            : isActive
            ? "linear-gradient(135deg, var(--accent), var(--accent-2))"
            : "rgba(255,255,255,0.08)",
          color: isCompleted || isActive ? "#fff" : "var(--muted)",
          boxShadow: isActive ? "0 0 12px rgba(56,189,248,0.35)" : "none",
        }}
      >
        {isCompleted ? "✓" : index + 1}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{stage.name}</span>
          <StagePill status={stage.status} />
        </div>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5 }}>
          {stage.description}
        </p>
        {stage.note && (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "0.8rem",
              color: "var(--accent-2)",
              fontStyle: "italic",
            }}
          >
            💬 {stage.note}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Project card ────────────────────────────────────────── */
function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  const stages = Array.isArray(project.stages) ? project.stages : [];

  return (
    <article
      className="project-card"
      style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "0" }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "6px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{project.title}</h3>
        <StagePill status={project.stage_status ?? "Discovery"} />
      </div>

      <p
        style={{
          margin: "0 0 16px",
          fontSize: "0.88rem",
          color: "var(--muted)",
          lineHeight: 1.55,
        }}
      >
        {project.summary}
      </p>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "16px",
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        {project.budget && (
          <span style={{ padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" }}>
            💰 {project.budget}
          </span>
        )}
        {project.timeline && (
          <span style={{ padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" }}>
            📅 {project.timeline}
          </span>
        )}
        {project.created_at && (
          <span style={{ padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" }}>
            🗓 {new Date(project.created_at).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {stages.length > 0 && <StageProgressBar stages={stages} />}

      {/* Toggle detail */}
      {stages.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              color: "var(--accent-2)",
              cursor: "pointer",
              padding: "8px 14px",
              fontSize: "0.84rem",
              fontWeight: 600,
              textAlign: "left",
              marginBottom: expanded ? "16px" : 0,
              transition: "border-color 0.2s",
            }}
          >
            {expanded ? "▲ Hide stage details" : "▼ View stage details"}
          </button>

          {expanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stages.map((stage, i) => (
                <StageRow key={stage.name} stage={stage} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
}

/* ── New project request form ────────────────────────────── */
function ProjectRequestForm({ clientEmail, onProjectAdded }) {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    budget: "",
    timeline: "",
    requirements: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientEmail, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to submit project request");

      setMessage("✅ Project request submitted successfully!");
      setForm({ title: "", summary: "", budget: "", timeline: "", requirements: "" });
      onProjectAdded();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="project-card" style={{ padding: "28px" }}>
      <h3 style={{ marginTop: 0, marginBottom: "6px" }}>Submit a new project</h3>
      <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: 0, marginBottom: "20px" }}>
        Describe what you'd like to build and we'll get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <PortalInput
          placeholder="Project title *"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          required
        />
        <PortalTextarea
          placeholder="Project summary — what problem does it solve? *"
          value={form.summary}
          onChange={(v) => setForm((f) => ({ ...f, summary: v }))}
          rows={4}
          required
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <PortalInput
            placeholder="Budget (e.g. KES 50,000)"
            value={form.budget}
            onChange={(v) => setForm((f) => ({ ...f, budget: v }))}
          />
          <PortalInput
            placeholder="Timeline (e.g. 4 weeks)"
            value={form.timeline}
            onChange={(v) => setForm((f) => ({ ...f, timeline: v }))}
          />
        </div>
        <PortalTextarea
          placeholder="Additional requirements or notes"
          value={form.requirements}
          onChange={(v) => setForm((f) => ({ ...f, requirements: v }))}
          rows={3}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ alignSelf: "flex-start", padding: "11px 24px" }}
        >
          {submitting ? "Submitting…" : "Submit project request"}
        </button>

        {message && (
          <p style={{ margin: 0, fontSize: "0.88rem", color: message.startsWith("✅") ? "var(--accent-2)" : "var(--accent-3)" }}>
            {message}
          </p>
        )}
      </form>
    </article>
  );
}

/* ── Small input helpers ─────────────────────────────────── */
function inputStyle() {
  return {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "rgba(255,255,255,0.04)",
    color: "var(--text)",
    fontSize: "0.93rem",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };
}

function PortalInput({ placeholder, value, onChange, required }) {
  return (
    <input
      style={inputStyle()}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      onFocus={(e) => { e.target.style.borderColor = "rgba(45,212,191,0.65)"; e.target.style.boxShadow = "0 0 0 3px rgba(45,212,191,0.18)"; }}
      onBlur={(e) => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
    />
  );
}

function PortalTextarea({ placeholder, value, onChange, rows, required }) {
  return (
    <textarea
      style={{ ...inputStyle(), resize: "vertical" }}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows ?? 3}
      required={required}
      onFocus={(e) => { e.target.style.borderColor = "rgba(45,212,191,0.65)"; e.target.style.boxShadow = "0 0 0 3px rgba(45,212,191,0.18)"; }}
      onBlur={(e) => { e.target.style.borderColor = ""; e.target.style.boxShadow = ""; }}
    />
  );
}

/* ── Main section ────────────────────────────────────────── */
export default function ClientPortalSection() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const fetchProjects = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`/api/clients/${encodeURIComponent(user.email)}/projects`);
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects ?? []);
        setLoadError("");
      } else {
        setLoadError(data.error ?? "Could not load projects.");
      }
    } catch {
      setLoadError("Network error — could not load projects.");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  /* Initial load + 10s poll for live updates */
  useEffect(() => {
    setLoading(true);
    fetchProjects();
    const timer = setInterval(fetchProjects, 10_000);
    return () => clearInterval(timer);
  }, [fetchProjects]);

  const displayName = user?.name || user?.email?.split("@")[0] || "Client";

  return (
    <section className="section">
      {/* Welcome banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        <div>
          <p className="eyebrow">Client Portal</p>
          <h2 style={{ margin: "0 0 6px" }}>Welcome back, {displayName} 👋</h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            Track your project progress and submit new requests.
          </p>
        </div>
        <div
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            background: "rgba(45,212,191,0.08)",
            border: "1px solid rgba(45,212,191,0.22)",
            fontSize: "0.82rem",
            color: "var(--accent-2)",
          }}
        >
          🔄 Updates every 10s
        </div>
      </div>

      {/* Summary stats */}
      {projects.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          {[
            { label: "Total projects", value: projects.length, icon: "📁" },
            {
              label: "In progress",
              value: projects.filter((p) => p.stage_status && p.stage_status !== "Deployment").length,
              icon: "🔄",
            },
            {
              label: "Completed",
              value: projects.filter((p) => p.stage_status === "Deployment").length,
              icon: "✅",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "16px 18px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{stat.icon}</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Project list */}
      <div style={{ marginBottom: "36px" }}>
        <h3 style={{ marginBottom: "16px" }}>
          Your projects{" "}
          {!loading && (
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 400,
                color: "var(--muted)",
                marginLeft: "6px",
              }}
            >
              ({projects.length})
            </span>
          )}
        </h3>

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--muted)",
              border: "1px dashed var(--border)",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⏳</div>
            Loading your projects…
          </div>
        ) : loadError ? (
          <div
            style={{
              padding: "24px",
              borderRadius: "14px",
              background: "rgba(255,64,129,0.08)",
              border: "1px solid rgba(255,64,129,0.25)",
              color: "var(--accent-3)",
              fontSize: "0.9rem",
            }}
          >
            {loadError}
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--muted)",
              border: "1px dashed var(--border)",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📭</div>
            <p style={{ margin: "0 0 6px", fontWeight: 600 }}>No projects yet</p>
            <p style={{ margin: 0, fontSize: "0.88rem" }}>
              Submit your first project request below to get started.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Submit new project */}
      <ProjectRequestForm clientEmail={user.email} onProjectAdded={fetchProjects} />
    </section>
  );
}
