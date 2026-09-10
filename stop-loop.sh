#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT_DIR/.loop-pids"

if [[ -f "$PID_FILE" ]]; then
  while read -r name pid; do
    [[ -z "$name" || -z "$pid" ]] && continue
    if kill -0 "$pid" 2>/dev/null; then
      echo "Stopping $name ($pid)"
      kill "$pid" 2>/dev/null || true
    fi
  done < "$PID_FILE"
  rm -f "$PID_FILE"
  exit 0
fi

echo "No PID registry found; falling back to pattern kill"
for pattern in "apps/auth/server.js" "apps/gateway/server.js" "apps/education/server.js" "apps/finance/server.js" "apps/healthcare/server.js" "apps/logistics/server.js" "apps/commerce/server.js" "apps/governance/server.js" "apps/dashboard/server.js"; do
  pids=$(pgrep -f "$pattern" || true)
  if [[ -n "$pids" ]]; then
    echo "$pids" | xargs -r kill -9
  fi
done
