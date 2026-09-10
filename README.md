# HAUZRAL-TECHNOLOGIES

## Unified platform architecture

This repo now supports a gateway-driven monorepo layout with one central API gateway, one auth service, one dashboard, and six business-unit services.

### Services

- Gateway: http://localhost:4000
- Auth: http://localhost:4010
- Dashboard: http://localhost:4173
- Education: http://localhost:4001
- Finance: http://localhost:4002
- Healthcare: http://localhost:4003
- Logistics: http://localhost:4004
- Commerce: http://localhost:4005
- Governance: http://localhost:4006

### Quick start

```bash
export PATH="/home/zral/.node/bin:$PATH"
cd /home/zral/zral/HAUZRAL-TECHNOLOGIES
npm install
npm run dev:auth
npm run dev:gateway
node apps/education/server.js
node apps/finance/server.js
node apps/healthcare/server.js
node apps/logistics/server.js
node apps/commerce/server.js
node apps/governance/server.js
node apps/dashboard/server.js
```

### Health checks

```bash
curl http://localhost:4000/api/health
curl http://localhost:4010/api/auth/health
curl http://localhost:4173/
```

### Docker Compose

```bash
docker compose up --build
```

This starts the gateway, auth, dashboard, and all unit services together.

### Environment

Copy [.env.example](.env.example) to .env and update the values before running the stack.

### CI/CD

The repo includes a GitHub Actions workflow in [.github/workflows/ci.yml](.github/workflows/ci.yml) that validates the Node workspace and runs build checks on each push or PR.
