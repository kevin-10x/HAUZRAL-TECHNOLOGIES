const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4010;
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret";

function issueToken(payload, expiresIn = "12h") {
  return jwt.sign({ org: "hauzral", ...payload }, JWT_SECRET, { expiresIn });
}

function getRoles(email) {
  if (email === "admin@hauzral.com") {
    return ["*", "finance:admin", "finance:read", "logistics:viewer"];
  }
  if (email.endsWith("@finance.hauzral.com")) {
    return ["finance:read", "finance:admin"];
  }
  if (email.endsWith("@logistics.hauzral.com")) {
    return ["logistics:viewer"];
  }
  return ["finance:read", "logistics:viewer"];
}

app.use(express.json());

app.get("/api/auth/health", (_req, res) => {
  res.json({ status: "ok", service: "hauzral-auth", port: PORT });
});

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const roles = getRoles(email);
  const sub = email === "admin@hauzral.com" ? "admin-1" : `user-${Date.now()}`;
  const token = issueToken({ sub, email, roles });

  return res.json({
    token,
    user: { sub, email, roles, org: "hauzral" },
  });
});

app.post("/api/auth/token", (req, res) => {
  const { email, roles } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  const token = issueToken({
    sub: `user-${Date.now()}`,
    email,
    roles: Array.isArray(roles) && roles.length ? roles : getRoles(email),
  });

  return res.json({ token });
});

app.get("/api/auth/me", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Missing bearer token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ user: payload });
  } catch (_error) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "NOT_FOUND", route: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`hauzral auth listening on :${PORT}`);
});

module.exports = { issueToken, getRoles };
