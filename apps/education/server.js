const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.get('/api/education/health', (_req, res) => {
  res.json({ status: 'ok', service: 'education', port: PORT });
});

app.get('/api/education', (req, res) => {
  const user = {
    id: req.headers['x-user-id'] || 'unknown',
    roles: req.headers['x-user-roles'] || '[]',
    requestId: req.headers['x-request-id'] || 'none',
  };
  res.json({ service: 'education', user });
});

app.listen(PORT, () => console.log(`education service listening on :${PORT}`));
