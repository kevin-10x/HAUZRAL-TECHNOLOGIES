import React, { useState } from "react";

const phases = [
  {
    title: "Phase 11 — FastAPI (Modern Python Backend)",
    duration: "2–3 weeks",
    learn: [
      "FastAPI fundamentals: path params, query params, request validation, response models",
      "Pydantic, Dependency Injection, Middleware, Authentication",
      "Async programming, WebSockets, File uploads, Background Tasks",
      "PostgreSQL with SQLAlchemy ORM and Alembic migrations",
      "JWT Authentication, OAuth2, Refresh Tokens, Password hashing, RBAC",
    ],
    build: "Production Student Management API with authentication, students, courses, enrollments, attendance, grades, search, pagination, and documentation.",
  },
  {
    title: "Phase 12 — Advanced PostgreSQL",
    duration: "1 week",
    learn: [
      "Views and Materialized Views",
      "Transactions, Indexes, Query Optimization",
      "Stored Procedures, Triggers, JSONB",
      "Full Text Search, Partitioning",
    ],
    build: "School Database project with optimized queries and advanced constraints.",
  },
  {
    title: "Phase 13 — Redis",
    duration: "~1 week",
    learn: [
      "Caching strategies for API responses",
      "Session storage for login state",
      "Rate limiting",
      "Queues for background processing",
    ],
    build: "Cache API responses, store login sessions, and implement rate-limiting on protected routes.",
  },
  {
    title: "Phase 14 — Celery",
    duration: "~1 week",
    learn: [
      "Background jobs and task queues",
      "Integration with Redis / RabbitMQ",
    ],
    build: "Background tasks for email sending, PDF generation, SMS notifications, and report generation.",
  },
  {
    title: "Phase 15 — Docker (Advanced)",
    duration: "~1 week",
    learn: [
      "Multi-stage Dockerfiles",
      "Docker Compose for multi-service environments",
      "Networking, Volumes, Secrets, Environment Variables",
    ],
    build: "Containerize API, PostgreSQL, Redis, Celery, and Nginx together as a production-ready stack.",
  },
  {
    title: "Phase 16 — Kubernetes",
    duration: "2 weeks",
    learn: [
      "Pods, ReplicaSets, Deployments, Services",
      "ConfigMaps, Secrets, Persistent Volumes, Ingress",
      "Helm charts, Horizontal Pod Autoscaler",
      "Deploy FastAPI + PostgreSQL + Redis on a cluster",
    ],
    build: "Deploy your FastAPI application to Kubernetes with production-grade manifests.",
  },
  {
    title: "Phase 17 — CI/CD",
    duration: "~1 week",
    learn: [
      "GitHub Actions workflows",
      "Docker Hub automated builds",
      "Automated testing and deployment pipelines",
      "Pipeline stages: Push Code → Run Tests → Build Image → Push Image → Deploy",
    ],
    build: "End-to-end pipeline for your FastAPI app with automated tests and Kubernetes deployment.",
  },
  {
    title: "Phase 18 — Cloud Computing",
    duration: "2 weeks",
    learn: [
      "AWS: EC2, S3, IAM, RDS, Lambda, ECS, EKS, CloudWatch, Route 53",
      "Azure: Virtual Machines, Azure SQL, Azure Storage, AKS",
      "Google Cloud: Compute Engine, Cloud Storage, Cloud SQL, GKE",
    ],
    build: "Deploy your containerized backend to a managed cloud provider and configure networking, storage, and observability.",
  },
  {
    title: "Phase 19 — System Design",
    duration: "2 weeks",
    learn: [
      "Load Balancers, Reverse Proxies, API Gateway",
      "Microservices, Event-driven Architecture, DDD, CQRS, Event Sourcing",
      "Message Brokers, Scaling, High Availability, Fault Tolerance",
      "Distributed Systems fundamentals",
    ],
    build: "Design and diagram a production-grade system for a school management or e-commerce platform.",
  },
  {
    title: "Phase 20 — Testing",
    duration: "~1 week",
    learn: [
      "pytest for unit, integration, and API testing",
      "Mocking external services",
      "Coverage reporting and test-driven workflows",
    ],
    build: "Add comprehensive test suites to your capstone API and deployment pipeline.",
  },
  {
    title: "Phase 21 — Monitoring",
    duration: "~1 week",
    learn: [
      "Prometheus for metrics collection",
      "Grafana for dashboards",
      "Loki for logging",
      "Alert strategies and SLO definition",
    ],
    build: "Instrument your deployed application with metrics, logs, and alerts.",
  },
  {
    title: "Phase 22 — Security",
    duration: "~1 week",
    learn: [
      "OWASP Top 10 vulnerabilities and mitigations",
      "SQL Injection, XSS, CSRF, Rate Limiting, HTTPS, API Security",
      "JWT best practices and secrets management",
    ],
    build: "Security audit report and hardened configuration for your deployed services.",
  },
  {
    title: "Phase 23 — Microservices",
    duration: "2 weeks",
    learn: [
      "Service boundaries and communication patterns (REST, events)",
      "Auth Service, Student/Course Service, Notification Service, Payment Service, Analytics Service",
    ],
    build: "Break your capstone into independently deployable microservices with message queues and event-driven sync.",
  },
  {
    title: "Phase 24 — Capstone Project",
    duration: "4–6 weeks",
    options: [
      {
        name: "Option 1: School Management System",
        modules: "Authentication, Students, Teachers, Parents, Finance, Exams, Attendance, Timetable, Library, Hostel, SMS, Email, Reports, Dashboard",
      },
      {
        name: "Option 2: Hospital Management System",
        modules: "Patients, Doctors, Pharmacy, Billing, Laboratory, Appointments, Reports",
      },
      {
        name: "Option 3: Multi-Shop POS System",
        modules: "Multi-tenant architecture, Inventory, Sales, Purchases, Profit calculation, Accounting, Barcode support, M-Pesa integration, Analytics dashboard, REST API, Mobile support",
      },
      {
        name: "Option 4: SaaS Platform for Hauzral Technologies",
        modules: "User authentication, Subscription management, Client dashboard, Admin dashboard, AI assistant integration, Project management, Invoicing, File storage, Notifications, PostgreSQL + FastAPI backend, Docker, Redis, Celery, Kubernetes, CI/CD, Monitoring",
      },
    ],
  },
];

const technologies = [
  { category: "Languages", items: "Python, SQL, JavaScript, Bash" },
  { category: "Backend", items: "Flask, FastAPI" },
  { category: "Databases", items: "PostgreSQL, MySQL, Redis" },
  { category: "ORM", items: "SQLAlchemy" },
  { category: "Authentication", items: "JWT, OAuth2" },
  { category: "APIs", items: "REST, WebSockets" },
  { category: "Containers", items: "Docker" },
  { category: "Orchestration", items: "Kubernetes" },
  { category: "Cloud", items: "AWS (or Azure / Google Cloud)" },
  { category: "CI/CD", items: "GitHub Actions" },
  { category: "Testing", items: "pytest" },
  { category: "Monitoring", items: "Prometheus, Grafana" },
  { category: "Architecture", items: "DDD, CQRS, Event-Driven Architecture, Microservices" },
  { category: "DevOps", items: "Docker Compose, Helm, Nginx" },
];

function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState(null);

  return (
    <section className="section">
      <div style={{ marginBottom: "40px" }}>
        <span className="eyebrow">Engineering Roadmap</span>
        <h2 style={{ fontSize: "2.4rem", marginTop: "8px", marginBottom: "16px" }}>
          From Backend Foundations to Production-Grade Systems
        </h2>
        <p className="hero-text" style={{ maxWidth: "800px" }}>
          A structured progression from basic backend skills through advanced architecture, cloud deployment,
          and a portfolio-ready capstone — built around the same technologies Hauzral Technologies uses in production.
        </p>
      </div>

      <div style={{ display: "grid", gap: "24px", marginBottom: "48px" }}>
        <article className="info-card" style={{ width: "100%" }}>
          <h3 style={{ marginTop: 0, color: "var(--accent)" }}>Recommended Progression</h3>
          <p style={{ color: "var(--muted)", lineHeight: "1.8" }}>
            Master an asynchronous Python framework such as <strong>FastAPI</strong> for high-performance APIs,
            deepen <strong>Kubernetes</strong> skills for container orchestration, explore <strong>cloud services
            (AWS / Azure / Google Cloud)</strong> for networking and managed databases, and study software
            architecture topics such as <strong>Domain-Driven Design (DDD)</strong>, <strong>CQRS</strong>, and
            event-driven systems. Cap the journey with a complete production-style project such as a school
            management system, e-commerce platform, hospital system, or SaaS product — including authentication,
            PostgreSQL, Docker, background jobs, and multiple services.
          </p>
        </article>
      </div>

      <div className="card-grid">
        {phases.map((phase, index) => (
          <article
            key={phase.title}
            className="project-card"
            style={{ cursor: "pointer" }}
            onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>{phase.title}</h3>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "999px",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  background: "rgba(16,185,129,0.12)",
                  color: "var(--accent)",
                  whiteSpace: "nowrap",
                }}
              >
                {phase.duration}
              </span>
            </div>

            {expandedPhase === index && (
              <>
                <div style={{ marginTop: "14px" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "0.88rem", color: "var(--accent-2)" }}>What To Learn</h4>
                  <ul style={{ paddingLeft: "18px", color: "var(--muted)", lineHeight: "1.8", margin: 0 }}>
                    {phase.learn.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {phase.build && (
                  <div style={{ marginTop: "16px", padding: "14px 16px", background: "rgba(16,185,129,0.06)", borderRadius: "16px" }}>
                    <h4 style={{ margin: "0 0 6px", fontSize: "0.88rem", color: "var(--accent-2)" }}>Build</h4>
                    <p style={{ margin: 0, color: "var(--muted)", lineHeight: "1.7", fontSize: "0.9rem" }}>{phase.build}</p>
                  </div>
                )}

                {phase.options && (
                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ margin: "0 0 10px", fontSize: "0.88rem", color: "var(--accent-2)" }}>Capstone Options</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {phase.options.map((option) => (
                        <div
                          key={option.name}
                          style={{
                            padding: "12px 14px",
                            background: "var(--surface)",
                            borderRadius: "14px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{option.name}</p>
                          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem", lineHeight: "1.6" }}>
                            {option.modules}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {expandedPhase !== index && (
              <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: "0.88rem" }}>
                Click to view learning topics and build project
              </p>
            )}
          </article>
        ))}
      </div>

      <div style={{ marginTop: "56px", marginBottom: "32px" }}>
        <span className="eyebrow">Knowledge Inventory</span>
        <h3 style={{ fontSize: "1.8rem", marginTop: "8px", marginBottom: "20px" }}>Final Technologies You will Master</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
          {technologies.map((tech) => (
            <div
              key={tech.category}
              style={{
                padding: "18px 20px",
                background: "var(--surface)",
                borderRadius: "20px",
                boxShadow: "var(--shadow)",
              }}
            >
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.85rem", color: "var(--accent-2)" }}>
                {tech.category}
              </p>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>{tech.items}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "48px" }}>
        <article className="info-card" style={{ width: "100%" }}>
          <h3 style={{ color: "var(--accent)", marginTop: 0 }}>Outcome</h3>
          <p style={{ color: "var(--muted)", lineHeight: "1.8" }}>
            By completing this roadmap, you will be able to:
          </p>
          <ul style={{ paddingLeft: "20px", color: "var(--muted)", lineHeight: "1.9" }}>
            <li>Design and build production-grade backend systems.</li>
            <li>Deploy scalable applications using Docker, Kubernetes, and cloud platforms.</li>
            <li>Develop secure APIs with authentication, authorization, and background processing.</li>
            <li>Apply modern software architecture patterns such as DDD, CQRS, and event-driven design.</li>
            <li>Build an impressive portfolio through real-world, end-to-end projects — including systems that directly support Hauzral Technologies.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default RoadmapPage;
