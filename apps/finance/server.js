const express = require('express');
const app = express();
const PORT = process.env.PORT || 4002;

app.use(express.json());

app.get('/api/finance/health', (_req, res) => {
  res.json({ status: 'ok', service: 'finance', port: PORT });
});

app.get('/api/finance', (req, res) => {
  const user = {
    id: req.headers['x-user-id'] || 'unknown',
    roles: req.headers['x-user-roles'] || '[]',
    requestId: req.headers['x-request-id'] || 'none',
  };
  res.json({ service: 'finance', user, reports: ['Revenue', 'Ledger', 'Cashflow'] });
});

app.listen(PORT, () => console.log(`finance service listening on :${PORT}`));
