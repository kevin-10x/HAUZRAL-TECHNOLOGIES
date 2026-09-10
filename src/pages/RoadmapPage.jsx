import React from "react";

const roadmap = [
  {
    phase: "Phase 01",
    title: "Positioning and platform foundation",
    description: "Clarify the service offer, brand narrative, and digital system foundation for the HAUZRAL business model.",
  },
  {
    phase: "Phase 02",
    title: "Unified gateway and auth layer",
    description: "Connect every business unit behind a secure gateway with a shared identity and protected API routing model.",
  },
  {
    phase: "Phase 03",
    title: "Operational dashboard and client portal",
    description: "Expose a real-time operating view for core business metrics, service health, and client-facing progress tracking.",
  },
  {
    phase: "Phase 04",
    title: "Automation and growth intelligence",
    description: "Add AI-assisted workflows, smart lead handling, and performance reporting to accelerate delivery and conversion.",
  },
];

function RoadmapPage() {
  return (
    <section className="section">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2>Roadmap</h2>
        <p>
          A practical path from launch-ready platform to sustainable growth engine for multiple HAUZRAL business units.
        </p>
        <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
          {roadmap.map((item) => (
            <div
              key={item.phase}
              style={{
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: 16,
                padding: 20,
                background: "rgba(15, 23, 42, 0.7)",
              }}
            >
              <div style={{ color: "#7dd3fc", fontWeight: 700, letterSpacing: 1.2, marginBottom: 8 }}>{item.phase}</div>
              <h3 style={{ margin: "0 0 8px" }}>{item.title}</h3>
              <p style={{ margin: 0, color: "#cbd5e1" }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoadmapPage;
