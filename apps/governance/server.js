const express = require('express');
const app = express();
const PORT = process.env.PORT || 4006;

app.use(express.json());

app.get('/api/governance/health', (_req, res) => {
  res.json({ status: 'ok', service: 'governance', port: PORT });
});

app.get('/api/governance', (req, res) => {
  const user = {
    id: req.headers['x-user-id'] || 'unknown',
    roles: req.headers['x-user-roles'] || '[]',
    requestId: req.headers['x-request-id'] || 'none',
  };
  res.json({ service: 'governance', user, modules: ['Compliance', 'Reporting', 'Risk'] });
});

app.listen(PORT, () => console.log(`governance service listening on :${PORT}`));
