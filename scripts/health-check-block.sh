#!/usr/bin/env python3
import json
import urllib.request

checks = [
    ("finance-read-status", "http://localhost:4000/api/test/finance-read", {"Authorization": "Bearer "}),
    ("finance-admin-status", "http://localhost:4000/api/test/finance-admin", {"Authorization": "Bearer "}),
]

login_req = urllib.request.Request(
    "http://localhost:4010/api/auth/login",
    data=json.dumps({"email": "admin@hauzral.com", "password": "secret"}).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(login_req, timeout=10) as r:
    login = json.loads(r.read().decode())

token = login["token"]

for name, url, headers in checks:
    req = urllib.request.Request(url, headers={**headers, "Authorization": f"Bearer {token}"}, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            body = json.loads(r.read().decode())
            print(f"OK    {name:<20} {r.status}  scope={body.get('scope', 'unknown')}")
    except Exception as exc:
        print(f"FAIL  {name:<20} error={type(exc).__name__}: {exc}")
        raise SystemExit(1)
