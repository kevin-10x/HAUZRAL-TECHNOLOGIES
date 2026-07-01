import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai"; // 1. Added OpenAI Import
import {
  createClient,
  createContactSubmission,
  createProject,
  db,
  findClientByEmail,
  initializeDatabase,
  listAllProjects,
  listContactSubmissions,
  listProjectsByClient,
  updateProjectProgress,
  upsertGoogleUser,
  deleteProject,
} from "./db.js";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const adminApiKey = process.env.ADMIN_API_KEY;

// 2. Initialize OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getAppUrl(req) {
  const configuredAppUrl = process.env.APP_URL?.trim();
  if (configuredAppUrl) {
    return configuredAppUrl.replace(/\/$/, "");
  }

  const forwardedProto = req.get("x-forwarded-proto") || "http";
  const forwardedHost = req.get("x-forwarded-host");
  const host = forwardedHost || req.get("host") || `localhost:${port}`;

  return `${forwardedProto}://${host}`;
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

function requireAdmin(req, res, next) {
  if (!adminApiKey) {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.get("x-admin-api-key") !== adminApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

app.get("/api/health", async (_req, res) => {
  if (!db) {
    return res.json({
      status: "ok",
      service: "hauzral-technologies",
      database: "not configured",
    });
  }

  try {
    await db.query("SELECT 1");
    return res.json({
      status: "ok",
      service: "hauzral-technologies",
      database: "connected",
    });
  } catch (error) {
    return res.status(503).json({
      status: "degraded",
      service: "hauzral-technologies",
      database: "unavailable",
      error: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.post("/api/contact", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const message = String(req.body?.message ?? "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "name, email, and message are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      error: "Enter a valid email address",
    });
  }

  if (message.length < 20) {
    return res.status(400).json({
      error: "Message should be at least 20 characters",
    });
  }

  try {
    const contact = await createContactSubmission({ name, email, message });

    return res.status(202).json({
      message: "Contact request stored",
      contact,
    });
  } catch (error) {
    return res.status(503).json({
      error: "Could not store contact request",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.get("/api/contact", requireAdmin, async (_req, res) => {
  try {
    const contacts = await listContactSubmissions();
    return res.json({ contacts });
  } catch (error) {
    return res.status(503).json({
      error: "Could not load contact requests",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.post("/api/clients/signup", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const company = String(req.body?.company ?? "").trim();
  const phone = String(req.body?.phone ?? "").trim();
  const projectType = String(req.body?.projectType ?? "").trim();

  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  try {
    const client = await createClient({ name, email, company, phone, projectType });
    return res.status(201).json({ message: "Client account created", client });
  } catch (error) {
    return res.status(503).json({
      error: "Could not create client account",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.post("/api/projects", async (req, res) => {
  const clientEmail = String(req.body?.clientEmail ?? "").trim().toLowerCase();
  const title = String(req.body?.title ?? "").trim();
  const summary = String(req.body?.summary ?? "").trim();
  const budget = String(req.body?.budget ?? "").trim();
  const timeline = String(req.body?.timeline ?? "").trim();
  const requirements = String(req.body?.requirements ?? "").trim();

  if (!clientEmail || !title || !summary) {
    return res.status(400).json({ error: "client email, title, and summary are required" });
  }

  try {
    const project = await createProject({
      clientEmail,
      title,
      summary,
      budget,
      timeline,
      requirements,
    });

    return res.status(201).json({ message: "Project request submitted", project });
  } catch (error) {
    return res.status(503).json({
      error: "Could not submit project request",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.get("/api/clients/:email/projects", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const projects = await listProjectsByClient(email);
    return res.json({ projects });
  } catch (error) {
    return res.status(503).json({
      error: "Could not load client projects",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.get("/api/clients/:email/verify", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const client = await findClientByEmail(email);
    if (!client) {
      return res.status(404).json({ error: "No client account found with that email." });
    }
    return res.json({ exists: true, name: client.name, email: client.email });
  } catch (error) {
    return res.status(503).json({
      error: "Could not verify client account",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.get("/api/admin/projects", requireAdmin, async (_req, res) => {
  try {
    const projects = await listAllProjects();
    return res.json({ projects });
  } catch (error) {
    return res.status(503).json({
      error: "Could not load admin projects",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.patch("/api/admin/projects/:projectId", requireAdmin, async (req, res) => {
  const projectId = Number(req.params.projectId);
  const { stageName, status, note } = req.body ?? {};

  if (!projectId || !stageName) {
    return res.status(400).json({ error: "project id and stage name are required" });
  }

  try {
    const project = await updateProjectProgress(projectId, { stageName, status, note });
    return res.json({ message: "Project progress updated", project });
  } catch (error) {
    return res.status(503).json({
      error: "Could not update project progress",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.delete("/api/admin/projects/:projectId", requireAdmin, async (req, res) => {
  const projectId = Number(req.params.projectId);

  if (!projectId) {
    return res.status(400).json({ error: "project id is required" });
  }

  try {
    await deleteProject(projectId);
    return res.json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(503).json({
      error: "Could not delete project",
      details: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

app.get("/api/auth/signin", (_req, res) => {
  res.json({
    message: "Use /api/auth/google to sign in with Google or /api/auth/signup to create an account.",
  });
});

function redirectToGoogleAuth(req, res, mode = "signin") {
  if (!googleClientId) {
    return res.status(501).json({
      error: "Google sign-in is not configured.",
      setup: "Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and APP_URL.",
    });
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const appUrl = getAppUrl(req);
  authUrl.searchParams.set("client_id", googleClientId);
  authUrl.searchParams.set("redirect_uri", `${appUrl}/api/auth/google/callback`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("prompt", "select_account");
  authUrl.searchParams.set("state", mode);

  return res.redirect(authUrl.toString());
}

app.get("/api/auth/signup", (req, res) => redirectToGoogleAuth(req, res, "signup"));

app.get("/api/auth/google", (req, res) => redirectToGoogleAuth(req, res, "signin"));

app.get("/api/auth/google/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!googleClientId || !googleClientSecret) {
    return res.status(501).json({
      error: "Google sign-in is not configured.",
      setup: "Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and APP_URL.",
    });
  }

  if (!code) {
    return res.status(400).json({ error: "Missing Google authorization code." });
  }

  try {
    const appUrl = getAppUrl(req);
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: String(code),
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(502).json({
        error: "Google token exchange failed.",
        details: tokens,
      });
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    const profile = await profileResponse.json();

    if (!profileResponse.ok) {
      return res.status(502).json({
        error: "Google profile lookup failed.",
        details: profile,
      });
    }

    if (!profile.sub || !profile.email) {
      return res.status(502).json({
        error: "Google profile response was missing required identity fields.",
      });
    }

    await upsertGoogleUser(profile);

    try {
      await createClient({
        name: profile.name || profile.email,
        email: profile.email,
        googleId: String(profile.sub),
      });
    } catch (_clientErr) {
      // Non-fatal
    }

    const frontendUrl = process.env.CLIENT_URL || process.env.APP_URL || "http://localhost:3000";

    const callbackUrl = new URL(`${frontendUrl}/auth-callback`);
    callbackUrl.searchParams.set("name",    profile.name    || "");
    callbackUrl.searchParams.set("email",   profile.email   || "");
    callbackUrl.searchParams.set("picture", profile.picture || "");
    callbackUrl.searchParams.set("role",    "client");
    callbackUrl.searchParams.set("redirect", "/client-portal");

    return res.redirect(callbackUrl.toString());
  } catch (error) {
    return res.status(500).json({
      error: "Google sign-in failed.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// 3. AI CHAT ROUTE (Upgraded with production error telemetry and assertions)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Incoming message:", message);

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("🔥 SYSTEM ERROR: OPENAI_API_KEY missing in runtime environment");
      return res.status(500).json({ error: "Server missing API key configuration" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are HAUZRAL AI Assistant. You help users inside HAUZRAL TECHNOLOGIES."
        },
        {
          role: "user",
          content: message.trim()
        }
      ]
    });

    console.log("OpenAI raw response received successfully.");

    const aiText = response?.choices?.[0]?.message?.content;

    if (!aiText) {
      return res.status(500).json({
        error: "AI returned empty response object"
      });
    }

    return res.json({
      response: aiText
    });

  } catch (err) {
    console.error("🔥 FULL AI ROUTE CRASH:", err?.response?.data || err);

    // 🔥 SMARTER FALLBACK: Handle OpenAI Quota limits gracefully
    if (err?.code === "insufficient_quota" || err?.status === 429) {
      return res.json({
        response: "AI service is temporarily unavailable due to usage limits. Please try again later."
      });
    }

    return res.status(500).json({
      error: "AI request failed",
      details: err?.message || "Unknown error occurred"
    });
  }
});

// Frontend Asset Fallbacks
app.use(express.static(distPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const server = app.listen(port, () => {
  console.log(`Hauzral app listening on port ${port}`);
});

initializeDatabase()
  .catch((error) => {
    console.warn("Database initialization unavailable; continuing without persistence.", error instanceof Error ? error.message : error);
  });

function shutdown() {
  server.close(async () => {
    if (db) {
      await db.end();
    }
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);