#!/usr/bin/env bash
set -euo pipefail

export PATH="/home/zral/.node/bin:$PATH"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
PID_FILE="$ROOT_DIR/.loop-pids"
LOG_DIR="/tmp/hauzral-loop"
mkdir -p "$LOG_DIR"
rm -f "$PID_FILE"

trap 'status=$?; if [[ $status -ne 0 ]]; then rm -f "$PID_FILE"; fi; exit $status' EXIT

for port in 4000 4010 4001 4002 4003 4004 4005 4006 4173; do
  if command -v lsof >/dev/null 2>&1; then
    lsof -ti tcp:"$port" 2>/dev/null | xargs -r kill -9 || true
  fi
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "$port"/tcp >/dev/null 2>&1 || true
  fi
done

start_and_track() {
  local name="$1"
  shift
  "$@" > "$LOG_DIR/${name}.log" 2>&1 &
  local pid="$!"
  echo "$name $pid" >> "$PID_FILE"
  echo "$pid"
}

JWT_SECRET="dev-only-insecure-secret" node apps/auth/server.js > "$LOG_DIR/auth.log" 2>&1 &
AUTH_PID="$!"
echo "auth $AUTH_PID" >> "$PID_FILE"

JWT_SECRET="dev-only-insecure-secret" node apps/gateway/server.js > "$LOG_DIR/gateway.log" 2>&1 &
GATEWAY_PID="$!"
echo "gateway $GATEWAY_PID" >> "$PID_FILE"

node apps/education/server.js > "$LOG_DIR/education.log" 2>&1 &
echo "education $!" >> "$PID_FILE"
node apps/finance/server.js > "$LOG_DIR/finance.log" 2>&1 &
echo "finance $!" >> "$PID_FILE"
node apps/healthcare/server.js > "$LOG_DIR/healthcare.log" 2>&1 &
echo "healthcare $!" >> "$PID_FILE"
node apps/logistics/server.js > "$LOG_DIR/logistics.log" 2>&1 &
echo "logistics $!" >> "$PID_FILE"
node apps/commerce/server.js > "$LOG_DIR/commerce.log" 2>&1 &
echo "commerce $!" >> "$PID_FILE"
node apps/governance/server.js > "$LOG_DIR/governance.log" 2>&1 &
echo "governance $!" >> "$PID_FILE"
node apps/dashboard/server.js > "$LOG_DIR/dashboard.log" 2>&1 &
echo "dashboard $!" >> "$PID_FILE"

for attempt in $(seq 1 30); do
  if python3 - <<'PY'
import urllib.request
checks = [
    'http://localhost:4010/api/auth/health',
    'http://localhost:4000/api/health',
    'http://localhost:4001/api/education/health',
    'http://localhost:4002/api/finance/health',
    'http://localhost:4003/api/healthcare/health',
    'http://localhost:4004/api/logistics/health',
    'http://localhost:4005/api/commerce/health',
    'http://localhost:4006/api/governance/health',
    'http://localhost:4173/'
]
for url in checks:
    try:
        with urllib.request.urlopen(url, timeout=3) as r:
            if not (200 <= r.status < 500):
                raise SystemExit(1)
    except Exception:
        raise SystemExit(1)
raise SystemExit(0)
PY
  then
    break
  fi
  sleep 1
  if ! kill -0 "$AUTH_PID" 2>/dev/null; then echo 'FAIL auth failed to boot'; exit 1; fi
  if ! kill -0 "$GATEWAY_PID" 2>/dev/null; then echo 'FAIL gateway failed to boot'; exit 1; fi
done

python3 "$ROOT_DIR/scripts/health-check-block.sh"

echo '--- HAUZRAL startup summary ---'
python3 - <<'PY'
import urllib.request
checks = [
    ('auth', 'http://localhost:4010/api/auth/health'),
    ('gateway', 'http://localhost:4000/api/health'),
    ('education', 'http://localhost:4001/api/education/health'),
    ('finance', 'http://localhost:4002/api/finance/health'),
    ('healthcare', 'http://localhost:4003/api/healthcare/health'),
    ('logistics', 'http://localhost:4004/api/logistics/health'),
    ('commerce', 'http://localhost:4005/api/commerce/health'),
    ('governance', 'http://localhost:4006/api/governance/health'),
    ('dashboard', 'http://localhost:4173/')
]
for name, url in checks:
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            status = r.status
            print(f"OK   {name:<12} {status}  {url}")
    except Exception as exc:
        print(f"FAIL {name:<12} error={type(exc).__name__}: {url}")
        raise SystemExit(1)
PY

echo 'full HAUZRAL loop ready'
wait "$AUTH_PID" "$GATEWAY_PID"
