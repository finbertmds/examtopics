const test = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { IncomingMessage, ServerResponse } = require('node:http');

process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'oauth-test-client';
process.env.GOOGLE_CLIENT_SECRET = randomBytes(32).toString('hex');

const app = require('../index');
const database = require('../services/databaseService');
const sheets = require('../services/sheetsService');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = new IncomingMessage({});
    req.method = 'GET';
    req.url = url;
    const res = new ServerResponse(req);
    res.end = (payload) => resolve({ status: res.statusCode, body: JSON.parse(payload) });
    app.handle(req, res, reject);
  });
}

test('liveness avoids dependencies and readiness coalesces and caches bounded probes', async (t) => {
  let mongoCalls = 0;
  let sheetsCalls = 0;
  let finishSheets;
  let timedOut = false;
  let probeEnabled = false;
  t.mock.method(database, 'testConnection', async () => {
    mongoCalls += 1;
    return mongoCalls === 1;
  });
  t.mock.method(sheets, 'testConnection', ({ signal } = {}) => {
    sheetsCalls += 1;
    if (!probeEnabled) return Promise.resolve(false);
    signal?.addEventListener('abort', () => { timedOut = true; });
    return new Promise((resolve) => { finishSheets = resolve; });
  });

  assert.equal((await get('/health')).status, 200);
  assert.equal(mongoCalls, 0);
  assert.equal(sheetsCalls, 0);

  probeEnabled = true;
  const requests = [get('/health/readiness'), get('/health/readiness')];
  const ready = await Promise.all(requests);
  assert.deepEqual(ready.map((response) => response.status), [200, 200]);
  assert.deepEqual(ready[0].body.services, { mongodb: 'connected', googleSheets: 'disconnected' });
  assert.equal(timedOut, true);
  assert.equal(mongoCalls, 1);
  assert.equal(sheetsCalls, 1);
  assert.equal((await get('/health/readiness')).status, 200);
  assert.equal(mongoCalls, 1);
  assert.equal(sheetsCalls, 1);

  const later = Date.now() + 31_000;
  t.mock.method(Date, 'now', () => later);
  const unready = await get('/health/readiness');
  assert.equal(unready.status, 503);
  assert.equal(mongoCalls, 2);
  assert.equal(sheetsCalls, 1);
  finishSheets(false);
});
