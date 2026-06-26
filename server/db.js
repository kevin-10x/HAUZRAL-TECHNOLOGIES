import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
const databaseSsl = process.env.DATABASE_SSL === "true";

const memoryStore = {
  contacts: [],
  users: [],
  clients: [],
  projects: [],
  nextIds: {
    contacts: 1,
    users: 1,
    clients: 1,
    projects: 1,
  },
};

export const db = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseSsl ? { rejectUnauthorized: false } : false,
    })
  : null;

function buildDefaultStages() {
  return [
    {
      name: "Discovery",
      description: "We confirm the goals, audience, and success criteria.",
      status: "In progress",
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Planning",
      description: "The solution blueprint, milestones, and delivery approach are defined.",
      status: "Queued",
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Design",
      description: "UX, UI, and product flows are prepared for review.",
      status: "Queued",
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Development",
      description: "The platform is built and integrated with your team workflows.",
      status: "Queued",
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Testing",
      description: "We run quality checks, bug fixes, and release validations.",
      status: "Queued",
      updatedAt: new Date().toISOString(),
    },
    {
      name: "Deployment",
      description: "The product is launched and handed over with support.",
      status: "Queued",
      updatedAt: new Date().toISOString(),
    },
  ];
}

function cloneStages(stages) {
  return (Array.isArray(stages) ? stages : []).map((stage) => ({ ...stage }));
}

export async function initializeDatabase() {
  if (!db) {
    console.warn("DATABASE_URL is not set. Using in-memory storage for local development.");
    return;
  }

  let lastError;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      await db.query("SELECT 1");
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (lastError) {
    throw lastError;
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      provider TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      name TEXT,
      email TEXT UNIQUE,
      picture TEXT,
      last_signed_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (provider, provider_id)
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      company TEXT,
      phone TEXT,
      project_type TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  try {
    await db.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS password TEXT;`);
  } catch (error) {
    console.error("Migration error adding password column to clients:", error);
  }

  try {
    await db.query(`ALTER TABLE clients ADD COLUMN IF NOT EXISTS google_id TEXT;`);
  } catch (error) {
    console.error("Migration error adding google_id column to clients:", error);
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS client_projects (
      id BIGSERIAL PRIMARY KEY,
      client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      budget TEXT,
      timeline TEXT,
      requirements TEXT,
      stage_status TEXT NOT NULL DEFAULT 'Discovery',
      stages JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function createContactSubmission({ name, email, message }) {
  if (!db) {
    const contact = {
      id: memoryStore.nextIds.contacts++,
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    };
    memoryStore.contacts.unshift(contact);
    return contact;
  }

  const result = await db.query(
    `
      INSERT INTO contact_submissions (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, message, created_at;
    `,
    [name, email, message],
  );

  return result.rows[0];
}

export async function listContactSubmissions() {
  if (!db) {
    return memoryStore.contacts.slice().sort((a, b) => b.id - a.id).slice(0, 50);
  }

  const result = await db.query(`
    SELECT id, name, email, message, created_at
    FROM contact_submissions
    ORDER BY created_at DESC
    LIMIT 50;
  `);

  return result.rows;
}

export async function upsertGoogleUser(profile) {
  if (!db) {
    const existingUser = memoryStore.users.find((user) => user.provider_id === String(profile.sub));
    const user = {
      id: existingUser ? existingUser.id : memoryStore.nextIds.users++,
      provider: "google",
      provider_id: String(profile.sub),
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      last_signed_in_at: new Date().toISOString(),
      created_at: existingUser ? existingUser.created_at : new Date().toISOString(),
    };

    if (existingUser) {
      Object.assign(existingUser, user);
      return existingUser;
    }

    memoryStore.users.push(user);
    return user;
  }

  const result = await db.query(
    `
      INSERT INTO users (provider, provider_id, name, email, picture)
      VALUES ('google', $1, $2, $3, $4)
      ON CONFLICT (provider, provider_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        picture = EXCLUDED.picture,
        last_signed_in_at = NOW()
      RETURNING id, provider, provider_id, name, email, picture, last_signed_in_at, created_at;
    `,
    [profile.sub, profile.name, profile.email, profile.picture],
  );

  return result.rows[0];
}

export async function createClient({ name, email, company, phone, projectType, password, googleId }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedName = String(name || "").trim();

  if (!normalizedName || !normalizedEmail) {
    throw new Error("name and email are required");
  }

  if (!db) {
    const existingClient = memoryStore.clients.find((client) => client.email === normalizedEmail);
    const client = {
      id: existingClient ? existingClient.id : memoryStore.nextIds.clients++,
      name: normalizedName,
      email: normalizedEmail,
      company,
      phone,
      project_type: projectType,
      password,
      google_id: googleId,
      created_at: existingClient ? existingClient.created_at : new Date().toISOString(),
    };

    if (existingClient) {
      Object.assign(existingClient, client);
      return existingClient;
    }

    memoryStore.clients.push(client);
    return client;
  }

  const result = await db.query(
    `
      INSERT INTO clients (name, email, company, phone, project_type, password, google_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        phone = EXCLUDED.phone,
        project_type = EXCLUDED.project_type,
        password = EXCLUDED.password,
        google_id = EXCLUDED.google_id
      RETURNING id, name, email, company, phone, project_type, created_at;
    `,
    [normalizedName, normalizedEmail, company, phone, projectType, password, googleId],
  );

  return result.rows[0];
}

export async function findClientByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  if (!db) {
    return memoryStore.clients.find(
      (client) => client.email === normalizedEmail
    ) || null;
  }

  const result = await db.query(
    `SELECT id, name, email, company, phone, project_type, google_id, created_at
     FROM clients WHERE LOWER(email) = $1;`,
    [normalizedEmail]
  );
  return result.rows[0] || null;
}

export async function findClientByEmailOrPhone(identifier) {
  const queryVal = String(identifier || "").trim().toLowerCase();
  if (!queryVal) return null;

  if (!db) {
    return memoryStore.clients.find(
      (client) =>
        client.email.toLowerCase() === queryVal ||
        (client.phone && client.phone.trim() === queryVal)
    ) || null;
  }

  const result = await db.query(
    `
      SELECT id, name, email, company, phone, project_type, password, google_id, created_at
      FROM clients
      WHERE LOWER(email) = $1 OR phone = $2;
    `,
    [queryVal, queryVal]
  );

  return result.rows[0] || null;
}

export async function findGoogleUser(providerId, email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!db) {
    return memoryStore.users.find(
      (u) => u.provider_id === String(providerId) && u.email.toLowerCase() === normalizedEmail
    ) || null;
  }

  const result = await db.query(
    `
      SELECT id, provider, provider_id, name, email, picture, last_signed_in_at, created_at
      FROM users
      WHERE provider_id = $1 AND LOWER(email) = $2;
    `,
    [providerId, normalizedEmail]
  );

  return result.rows[0] || null;
}

export async function createProject({ clientEmail, title, summary, budget, timeline, requirements }) {
  const normalizedEmail = String(clientEmail || "").trim().toLowerCase();
  const normalizedTitle = String(title || "").trim();
  const normalizedSummary = String(summary || "").trim();

  if (!normalizedEmail || !normalizedTitle || !normalizedSummary) {
    throw new Error("client email, title, and summary are required");
  }

  if (!db) {
    const client = memoryStore.clients.find((item) => item.email === normalizedEmail);
    if (!client) {
      throw new Error("Client account not found");
    }

    const stages = buildDefaultStages();
    const project = {
      id: memoryStore.nextIds.projects++,
      client_id: client.id,
      title: normalizedTitle,
      summary: normalizedSummary,
      budget,
      timeline,
      requirements,
      stage_status: "Discovery",
      stages,
      created_at: new Date().toISOString(),
      client_name: client.name,
      client_email: client.email,
      company: client.company,
      phone: client.phone,
      project_type: client.project_type,
    };

    memoryStore.projects.unshift(project);
    return project;
  }

  const clientResult = await db.query(`
    SELECT id FROM clients WHERE email = $1;
  `, [normalizedEmail]);

  if (!clientResult.rowCount) {
    throw new Error("Client account not found");
  }

  const stages = buildDefaultStages();
  const result = await db.query(
    `
      INSERT INTO client_projects (client_id, title, summary, budget, timeline, requirements, stage_status, stages)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, client_id, title, summary, budget, timeline, requirements, stage_status, stages, created_at;
    `,
    [
      clientResult.rows[0].id,
      normalizedTitle,
      normalizedSummary,
      budget,
      timeline,
      requirements,
      "Discovery",
      JSON.stringify(stages),
    ],
  );

  return {
    ...result.rows[0],
    stages: result.rows[0].stages ?? stages,
  };
}

export async function listProjectsByClient(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!db) {
    return memoryStore.projects
      .filter((project) => project.client_email === normalizedEmail)
      .map((project) => ({ ...project, stages: cloneStages(project.stages ?? []) }));
  }

  const result = await db.query(
    `
      SELECT cp.id, cp.title, cp.summary, cp.budget, cp.timeline, cp.requirements, cp.stage_status, cp.stages, cp.created_at,
             c.name AS client_name, c.email AS client_email
      FROM client_projects cp
      JOIN clients c ON c.id = cp.client_id
      WHERE c.email = $1
      ORDER BY cp.created_at DESC;
    `,
    [normalizedEmail],
  );

  return result.rows.map((row) => ({
    ...row,
    stages: row.stages ?? [],
  }));
}

export async function listAllProjects() {
  if (!db) {
    return memoryStore.projects
      .slice()
      .map((project) => ({ ...project, stages: cloneStages(project.stages ?? []) }));
  }

  const result = await db.query(`
    SELECT cp.id, cp.title, cp.summary, cp.budget, cp.timeline, cp.requirements, cp.stage_status, cp.stages, cp.created_at,
           c.name AS client_name, c.email AS client_email, c.company, c.phone, c.project_type
    FROM client_projects cp
    JOIN clients c ON c.id = cp.client_id
    ORDER BY cp.created_at DESC;
  `);

  return result.rows.map((row) => ({
    ...row,
    stages: row.stages ?? [],
  }));
}

export async function updateProjectProgress(projectId, { stageName, status, note }) {
  if (!db) {
    const project = memoryStore.projects.find((item) => item.id === Number(projectId));
    if (!project) {
      throw new Error("Project not found");
    }

    const currentStages = cloneStages(project.stages ?? []);
    const stageIndex = currentStages.findIndex((stage) => stage.name === stageName);

    if (stageIndex === -1) {
      throw new Error("Stage not found");
    }

    const nextStages = currentStages.map((stage, index) => {
      if (index < stageIndex) {
        return { ...stage, status: "Completed", updatedAt: new Date().toISOString() };
      }

      if (index === stageIndex) {
        return {
          ...stage,
          status: status || "In progress",
          updatedAt: new Date().toISOString(),
          note: note || stage.note || "",
        };
      }

      return { ...stage, status: "Queued", updatedAt: new Date().toISOString() };
    });

    project.stage_status = stageName;
    project.stages = nextStages;
    return { ...project, stages: cloneStages(nextStages) };
  }

  const projectResult = await db.query(
    `
      SELECT stages, stage_status
      FROM client_projects
      WHERE id = $1;
    `,
    [projectId],
  );

  if (!projectResult.rowCount) {
    throw new Error("Project not found");
  }

  const currentStages = Array.isArray(projectResult.rows[0].stages)
    ? projectResult.rows[0].stages
    : [];
  const stageIndex = currentStages.findIndex((stage) => stage.name === stageName);

  if (stageIndex === -1) {
    throw new Error("Stage not found");
  }

  const nextStages = currentStages.map((stage, index) => {
    if (index < stageIndex) {
      return { ...stage, status: "Completed", updatedAt: new Date().toISOString() };
    }

    if (index === stageIndex) {
      return {
        ...stage,
        status: status || "In progress",
        updatedAt: new Date().toISOString(),
        note: note || stage.note || "",
      };
    }

    return { ...stage, status: "Queued", updatedAt: new Date().toISOString() };
  });

  const result = await db.query(
    `
      UPDATE client_projects
      SET stage_status = $1, stages = $2
      WHERE id = $3
      RETURNING id, title, summary, budget, timeline, requirements, stage_status, stages, created_at;
    `,
    [stageName, JSON.stringify(nextStages), projectId],
  );

  return {
    ...result.rows[0],
    stages: result.rows[0].stages ?? nextStages,
  };
}

export async function deleteProject(projectId) {
  if (!db) {
    const initialLength = memoryStore.projects.length;
    memoryStore.projects = memoryStore.projects.filter((item) => item.id !== Number(projectId));
    if (memoryStore.projects.length === initialLength) {
      throw new Error("Project not found");
    }
    return { success: true };
  }

  const result = await db.query(
    `
      DELETE FROM client_projects
      WHERE id = $1;
    `,
    [projectId],
  );

  if (!result.rowCount) {
    throw new Error("Project not found");
  }

  return { success: true };
}

