const express = require('express');
const database = require('../services/databaseService');
const sheets = require('../services/sheetsService');

const router = express.Router();
const PROBE_TIMEOUT_MS = 2_000;
const CACHE_MS = 30_000;

function cachedProbe(check) {
  let cached = false;
  let cacheUntil = 0;
  let pending;

  return function getResult() {
    if (Date.now() < cacheUntil) return cached;
    if (pending) return pending;

    const controller = new AbortController();
    let timer;
    const timeout = new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(false);
        controller.abort();
      }, PROBE_TIMEOUT_MS);
    });
    const probe = Promise.resolve()
      .then(() => check(controller.signal))
      .then((result) => result === true, () => false)
      .finally(() => {
        clearTimeout(timer);
        pending = undefined;
      });
    pending = Promise.race([probe, timeout]).then((result) => {
      cached = result;
      cacheUntil = Date.now() + CACHE_MS;
      return result;
    });
    return pending;
  };
}

const mongoReady = cachedProbe((signal) => database.testConnection({ signal }));
const sheetsReady = cachedProbe((signal) => sheets.testConnection({ signal }));

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

router.get('/', (req, res) => res.json({ success: true, status: 'healthy' }));

router.get('/readiness', async (req, res) => {
  const [mongodb, googleSheets] = await Promise.all([mongoReady(), sheetsReady()]);
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
