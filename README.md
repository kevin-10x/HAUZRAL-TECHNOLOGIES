# HAUZRAL-TECHNOLOGIES

## Deployment readiness

This project is set up to run as a Node.js + Express server with a Vite frontend build. For a clean redeploy, use reproducible installs and start the server directly from the server entrypoint.

### Prerequisites

- Node.js 20+
- npm 10+
- A PostgreSQL database (optional if you want to rely on in-memory storage during local development)

### Local development

```bash
npm ci
npm run build
npm start
```

The app will start on port 3000 unless you set a different PORT environment variable.

### Required environment variables

Copy [.env.example](.env.example) to .env and fill in the values before starting the app.

- APP_URL: public base URL for OAuth redirects (for example http://localhost:3000)
- PORT: HTTP port to bind to (default 3000)
- DATABASE_URL: PostgreSQL connection string
- DATABASE_SSL: set to true when your database requires SSL
- ADMIN_API_KEY: required for protected admin endpoints
- GOOGLE_CLIENT_ID: Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Google OAuth client secret

### Docker

```bash
docker compose build
docker compose up
```

The container uses npm ci during build and starts the server with node server/index.js.

### Health check

```bash
curl http://localhost:3000/api/health
```
