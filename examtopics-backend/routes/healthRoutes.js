const express = require('express');
const { checkReadiness } = require('../services/healthService');

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.get('/', (req, res) => res.json({ success: true, status: 'healthy' }));

router.get('/readiness', async (req, res) => {
  const { mongodb, googleSheets } = await checkReadiness();
  return res.status(mongodb ? 200 : 503).json({
    success: mongodb,
    status: mongodb ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongodb ? 'connected' : 'disconnected',
      googleSheets: googleSheets ? 'connected' : 'disconnected',
    },
  });
});

module.exports = router;
