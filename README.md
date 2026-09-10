# HAUZRAL Technologies

HAUZRAL is a unified platform architecture for multiple business units behind one gateway, one auth layer, and one operational dashboard.

## Overview

This repo models a modular multi-service stack with:
- a central API gateway
- a JWT auth service
- a unified dashboard
- six business-unit services
- a repeatable startup and verification loop

## Service map

- Gateway: http://localhost:4000
- Auth: http://localhost:4010
- Dashboard: http://localhost:4173
- Education: http://localhost:4001
- Finance: http://localhost:4002
- Healthcare: http://localhost:4003
- Logistics: http://localhost:4004
- Commerce: http://localhost:4005
- Governance: http://localhost:4006

## Startup

Use the built-in loop to bootstrap the full stack:

```bash
cd /home/zral/zral/HAUZRAL-TECHNOLOGIES
npm install
npm run dev:all
```

Stop the stack with:

```bash
npm run stop:all
```

## Manual startup

If needed, you can also start services individually:

```bash
export PATH="/home/zral/.node/bin:$PATH"
cd /home/zral/zral/HAUZRAL-TECHNOLOGIES
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

## Verification

The loop validates:
- auth health
- gateway health
- all unit service health checks
- real JWT-protected gateway requests

Example expected output:

```text
OK    finance-read-status  200  scope=finance:read
OK    finance-admin-status 200  scope=finance:admin
```

## Environment

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

## Docker

The repo includes a Docker Compose configuration for the same topology:

```bash
docker compose up --build
```

> Docker validation depends on Docker being available in the host environment.

## Notes

This project is designed around a repeatable engineering loop:
- spec
- implement
- boot
- verify
- cleanup
- repeat

It is meant to keep the stack honest by proving runtime behavior, not just code shape.
