const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const registry = require("../../config/services.json");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret";

function authenticate(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next({ statusCode: 401, code: "UNAUTHORIZED", message: "Missing bearer token" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (_error) {
    return next({ statusCode: 401, code: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}

function authorize(...requiredScopes) {
  return (req, _res, next) => {
    const roles = req.user?.roles || [];
    const ok = requiredScopes.some((scope) => roles.includes(scope) || roles.includes("*"));

    if (!ok) {
      return next({ statusCode: 403, code: "FORBIDDEN", message: `Requires scope: ${requiredScopes.join(" or ")}` });
    }

    return next();
  };
}

app.use(express.json());

app.use((req, _res, next) => {
  req.requestId = crypto.randomUUID();
  next();
});

app.get("/api/health", (_req, res) => {
  const services = Object.entries(registry.services).map(([name, svc]) => ({
    name,
    url: svc.url,
    prefix: svc.prefix,
    status: "registered",
  }));

  res.json({
    status: "ok",
    gateway: "hauzral",
    auth: registry.auth ? { url: registry.auth.url, prefix: registry.auth.prefix } : null,
    services,
  });
});

if (registry.auth) {
  app.use(
    registry.auth.prefix,
    createProxyMiddleware({
      target: registry.auth.url,
      changeOrigin: true,
      onError: (err, _req, res) => {
        res.status(503).json({ error: "AUTH_SERVICE_UNAVAILABLE", message: err.message });
      },
    })
  );
}

app.use("/api", authenticate);

for (const [name, svc] of Object.entries(registry.services)) {
  app.use(
    svc.prefix,
    createProxyMiddleware({
      target: svc.url,
      changeOrigin: true,
      onProxyReq: (proxyReq, req) => {
        proxyReq.setHeader("x-user-id", req.user?.sub || "anonymous");
        proxyReq.setHeader("x-user-roles", JSON.stringify(req.user?.roles || []));
        proxyReq.setHeader("x-request-id", req.requestId);
      },
      onError: (err, _req, res) => {
        res.status(503).json({ error: "SERVICE_UNAVAILABLE", service: name, message: err.message });
      },
    })
  );
}

app.get("/api/test/finance-read", authorize("finance:read"), (_req, res) => {
  res.json({ ok: true, scope: "finance:read" });
});

app.get("/api/test/finance-admin", authorize("finance:admin"), (_req, res) => {
  res.json({ ok: true, scope: "finance:admin" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "NOT_FOUND" });
});

app.use((err, req, res, _next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.code || "INTERNAL_ERROR", message: err.message });
});

app.listen(PORT, () => {
  console.log(`gateway listening on :${PORT}`);
});

module.exports = { authenticate, authorize };
