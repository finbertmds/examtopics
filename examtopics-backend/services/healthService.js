const database = require('./databaseService');
const sheets = require('./sheetsService');

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

// Dependency readiness for /health/readiness. Probes are bounded and cached.
async function checkReadiness() {
  const [mongodb, googleSheets] = await Promise.all([mongoReady(), sheetsReady()]);
  return { mongodb, googleSheets };
}

module.exports = { checkReadiness };
