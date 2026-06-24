import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
const databaseSsl = process.env.DATABASE_SSL === "true";

export const db = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseSsl ? { rejectUnauthorized: false } : false,
    })
  : null;

export async function initializeDatabase() {
  if (!db) {
    console.warn("DATABASE_URL is not set. Database-backed features are disabled.");
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
}

export async function createContactSubmission({ name, email, message }) {
  if (!db) {
    throw new Error("Database is not configured");
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
    throw new Error("Database is not configured");
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
    throw new Error("Database is not configured");
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
