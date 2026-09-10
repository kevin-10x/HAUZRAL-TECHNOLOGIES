# HAUZRAL Integration Notes

## Gateway
The gateway sits at `http://localhost:4000` and routes ` /api/<unit>` traffic to the corresponding service.

## Auth
The auth service runs at `http://localhost:4010` and issues JWTs for login and token exchange flows.

## Unit Registry
The registry lives in `config/services.json` and maintains the list of units and their upstream URLs.

## Security Rules
- Public routes: `/api/health`, `/api/auth/*`
- Protected routes: `/api/<unit>/*`
- Identity is passed downstream via `x-user-id`, `x-user-roles`, and `x-request-id`
- Cross-unit calls must route via the gateway only

## Local startup
```bash
export PATH="/home/zral/.node/bin:$PATH"
npm run dev:auth
npm run dev:gateway
npm run dev:dashboard
```

## Example login
```bash
curl -X POST http://localhost:4010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hauzral.com","password":"secret"}'
```
