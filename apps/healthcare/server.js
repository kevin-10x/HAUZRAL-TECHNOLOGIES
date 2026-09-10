const express = require('express');
const app = express();
const PORT = process.env.PORT || 4003;

app.use(express.json());

app.get('/api/healthcare/health', (_req, res) => {
  res.json({ status: 'ok', service: 'healthcare', port: PORT });
});

app.get('/api/healthcare', (req, res) => {
  const user = {
    id: req.headers['x-user-id'] || 'unknown',
    roles: req.headers['x-user-roles'] || '[]',
    requestId: req.headers['x-request-id'] || 'none',
  };
  res.json({ service: 'healthcare', user, modules: ['Appointments', 'Records', 'Billing'] });
});

app.listen(PORT, () => console.log(`healthcare service listening on :${PORT}`));
