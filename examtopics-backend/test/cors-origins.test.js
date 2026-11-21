const test = require('node:test');
const assert = require('node:assert/strict');
const getCorsOrigins = require('../utils/corsOrigins');

// SEC-027: production trusts only the configured frontend origin.

function withEnv(t, values) {
  const previous = {};
  for (const [name, value] of Object.entries(values)) {
    previous[name] = process.env[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  t.after(() => {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });
}

test('a staging API in production mode does not trust the Render production frontend', (t) => {
  withEnv(t, { NODE_ENV: 'production', FRONTEND_URL: 'https://app.staging.example.test/' });
  assert.deepEqual(getCorsOrigins(), ['https://app.staging.example.test']);
});

test('production without FRONTEND_URL keeps the existing Render frontend origin', (t) => {
  withEnv(t, { NODE_ENV: 'production', FRONTEND_URL: undefined });
  assert.deepEqual(getCorsOrigins(), ['https://examtopics.onrender.com']);
});

test('the configured production FRONTEND_URL is trimmed and its trailing slash ignored', (t) => {
  withEnv(t, { NODE_ENV: 'production', FRONTEND_URL: ' https://examtopics.onrender.com/ ' });
  assert.equal(require('../utils/frontendUrl')(), 'https://examtopics.onrender.com');
  assert.deepEqual(getCorsOrigins(), ['https://examtopics.onrender.com']);
});

test('development allows the local dev servers plus the configured frontend', (t) => {
  withEnv(t, { NODE_ENV: 'development', FRONTEND_URL: 'http://localhost:3000' });
  assert.deepEqual(getCorsOrigins(), ['http://localhost:3000', 'http://localhost:3001']);

  withEnv(t, { NODE_ENV: 'development', FRONTEND_URL: 'http://app.localhost:5173/path' });
  assert.deepEqual(getCorsOrigins(), ['http://localhost:3000', 'http://localhost:3001', 'http://app.localhost:5173']);
});
