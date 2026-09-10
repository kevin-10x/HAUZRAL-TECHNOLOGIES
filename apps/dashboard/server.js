const express = require("express");

const app = express();
const PORT = process.env.PORT || 4173;

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HAUZRAL Dashboard</title>
    <style>
      :root {
        --bg: #07111f;
        --bg-soft: #0d1b2a;
        --panel: rgba(16, 32, 48, 0.9);
        --border: rgba(148, 163, 184, 0.18);
        --text: #e2e8f0;
        --muted: #94a3b8;
        --green: #34d399;
        --amber: #fbbf24;
        --blue: #60a5fa;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: radial-gradient(circle at top, #0f213a 0%, var(--bg) 42%);
        color: var(--text);
        font-family: Inter, Arial, sans-serif;
      }
      .wrap { max-width: 1180px; margin: 40px auto; padding: 24px; }
      .hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 20px 24px;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 18px;
        box-shadow: 0 20px 60px rgba(2, 6, 23, 0.35);
      }
      .title { margin: 0; font-size: clamp(2rem, 4vw, 3rem); }
      .status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        font-weight: 700;
        background: rgba(52, 211, 153, 0.14);
        color: var(--green);
        border: 1px solid rgba(52, 211, 153, 0.32);
      }
      .summary {
        margin-top: 18px;
        color: var(--muted);
        font-size: 1rem;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
        margin-top: 22px;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 18px;
        transition: transform 0.2s ease, border-color 0.2s ease;
      }
      .card:hover { transform: translateY(-2px); border-color: rgba(96, 165, 250, 0.45); }
      .card h3 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #f8fafc;
        font-size: 1.1rem;
      }
      .tag {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(96, 165, 250, 0.15);
        color: var(--blue);
        font-size: 0.74rem;
        margin-bottom: 12px;
      }
      .meta {
        color: var(--muted);
        margin: 6px 0;
        font-size: 0.9rem;
      }
      code {
        background: rgba(148, 163, 184, 0.12);
        color: #dbeafe;
        padding: 2px 6px;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="hero">
        <div>
          <h1 class="title">HAUZRAL Unified Dashboard</h1>
          <div class="summary" id="summary">Checking gateway health...</div>
        </div>
        <div class="status" id="status">Loading...</div>
      </div>
      <div class="grid" id="units"></div>
    </div>
    <script>
      async function load() {
        try {
          const res = await fetch('http://localhost:4000/api/health');
          const data = await res.json();
          const status = document.getElementById('status');
          const summary = document.getElementById('summary');
          const units = document.getElementById('units');

          status.textContent = data.status === 'ok' ? 'Gateway online' : 'Gateway degraded';
          status.style.background = data.status === 'ok' ? 'rgba(52, 211, 153, 0.14)' : 'rgba(251, 191, 36, 0.13)';
          status.style.color = data.status === 'ok' ? '#34d399' : '#fbbf24';
          summary.textContent = 'Gateway: ' + data.gateway + ' • Services registered: ' + data.services.length;
          units.innerHTML = data.services.map((svc) => (
            '<div class="card"><div class="tag">' + svc.name + '</div><div class="meta"><code>' + svc.prefix + '</code></div><div class="meta">' + svc.url + '</div><div class="meta">Status: ' + svc.status + '</div></div>'
          )).join('');
        } catch (error) {
          document.getElementById('status').textContent = 'Gateway unavailable';
          document.getElementById('summary').textContent = 'Unable to reach http://localhost:4000/api/health';
          console.error(error);
        }
      }
      load();
    </script>
  </body>
</html>`;

app.get("/api/dashboard/summary", async (_req, res) => {
  try {
    const response = await fetch("http://localhost:4000/api/health");
    const data = await response.json();
    res.json({ ok: response.ok, data });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.get("/", (_req, res) => {
  res.type("html").send(html);
});

app.listen(PORT, () => {
  console.log(`hauzral dashboard listening on :${PORT}`);
});
