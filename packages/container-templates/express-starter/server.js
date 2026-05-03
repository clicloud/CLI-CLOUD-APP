const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory store (replace with a real database)
const items = [];

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'CLI',
    message: 'Express API is running. Start building your backend.',
    endpoints: {
      list: 'GET /items',
      create: 'POST /items {"name": "..."}',
      health: 'GET /health',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const item = {
    id: items.length + 1,
    name: req.body.name || 'unnamed',
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  res.status(201).json(item);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express API running on port ${PORT} — deployed on CLI`);
});
