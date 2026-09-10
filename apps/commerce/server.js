const express = require('express');
const app = express();
const PORT = process.env.PORT || 4005;

app.use(express.json());

app.get('/api/commerce/health', (_req, res) => {
  res.json({ status: 'ok', service: 'commerce', port: PORT });
});

app.get('/api/commerce', (req, res) => {
  const user = {
    id: req.headers['x-user-id'] || 'unknown',
    roles: req.headers['x-user-roles'] || '[]',
    requestId: req.headers['x-request-id'] || 'none',
  };
  res.json({ service: 'commerce', user, catalog: ['Products', 'Orders', 'Pricing'] });
});

app.listen(PORT, () => console.log(`commerce service listening on :${PORT}`));
