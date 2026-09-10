const express = require('express');
const app = express();
const PORT = process.env.PORT || 4004;

app.use(express.json());

app.get('/api/logistics/health', (_req, res) => {
  res.json({ status: 'ok', service: 'logistics', port: PORT });
});

app.get('/api/logistics', (req, res) => {
  const user = {
    id: req.headers['x-user-id'] || 'unknown',
    roles: req.headers['x-user-roles'] || '[]',
    requestId: req.headers['x-request-id'] || 'none',
  };
  res.json({ service: 'logistics', user, fleet: ['Routes', 'Dispatch', 'Inventory'] });
});

app.listen(PORT, () => console.log(`logistics service listening on :${PORT}`));
