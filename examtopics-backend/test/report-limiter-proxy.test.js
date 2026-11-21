const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { IncomingMessage, ServerResponse } = require('node:http');
const { PassThrough } = require('node:stream');
const { randomBytes } = require('node:crypto');
const express = require('express');

// Hermetic fixtures (no local .env): authService builds the OAuth strategy at require time,
// and the spawned index.js inherits these values.
process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'oauth-test-client';
process.env.GOOGLE_CLIENT_SECRET = randomBytes(32).toString('hex');
process.env.JWT_SECRET = randomBytes(32).toString('hex');
process.env.SESSION_SECRET = randomBytes(32).toString('hex');
delete process.env.MONGO_URI;

const parseTrustProxy = require('../utils/trustProxy');
const Sheets = require('../services/sheetsService');
const { createReportRouter } = require('../routes/reportRoutes');

// SEC-022: the report limiter keys on req.ip; TRUST_PROXY is an explicit hop count only.

test('TRUST_PROXY accepts only a small hop count or nothing', () => {
  assert.equal(parseTrustProxy(undefined), false);
  assert.equal(parseTrustProxy(''), false);
  assert.equal(parseTrustProxy('1'), 1);
  assert.equal(parseTrustProxy('5'), 5);
  for (const value of ['true', 'TRUE', '0', '6', '01', '1,2', 'loopback', '10.0.0.0/8', ' 1']) {
    assert.throws(() => parseTrustProxy(value), /TRUST_PROXY/, value);
  }
});

function loadApp(trustProxy) {
  const script = `const app = require(${JSON.stringify(path.join(__dirname, '..', 'index.js'))}); console.log('TRUST=' + JSON.stringify(app.get('trust proxy')));`;
  return spawnSync(process.execPath, ['-e', script], {
    cwd: os.tmpdir(), // no local .env is loaded
    encoding: 'utf8',
    timeout: 20000,
    env: { ...process.env, NODE_ENV: 'test', TRUST_PROXY: trustProxy },
  });
}

test('the app applies a valid TRUST_PROXY and refuses to start with an unsafe one', () => {
  const unset = loadApp('');
  assert.equal(unset.status, 0, unset.stderr);
  assert.match(unset.stdout, /TRUST=false/);

  const one = loadApp('1');
  assert.equal(one.status, 0, one.stderr);
  assert.match(one.stdout, /TRUST=1/);

  const unsafe = loadApp('true');
  assert.notEqual(unsafe.status, 0);
  assert.match(unsafe.stderr, /TRUST_PROXY must be/);
});

const report = JSON.stringify({ examId: 'saa-c03', topicNumber: 1, questionNumber: 2, reason: 'Other' });

function isolatedApp(trustProxy) {
  const app = express();
  if (trustProxy) app.set('trust proxy', trustProxy);
  app.use('/report', createReportRouter());
  return app;
}

function post(app, { peer, forwarded }) {
  return new Promise((resolve, reject) => {
    const socket = new PassThrough();
    socket.remoteAddress = peer;
    const req = new IncomingMessage(socket);
    req.complete = true;
    req.method = 'POST';
    req.url = '/report';
    req.headers = { 'content-type': 'application/json', 'content-length': String(Buffer.byteLength(report)) };
    if (forwarded) req.headers['x-forwarded-for'] = forwarded;
    req.push(Buffer.from(report));
    req.push(null);
    const res = new ServerResponse(req);
    res.end = () => resolve(res.statusCode);
    app.handle(req, res, reject);
  });
}

const PROXY = '10.0.0.2';

test('without TRUST_PROXY, X-Forwarded-For is ignored and the socket peer is the client', async (t) => {
  t.mock.method(Sheets, 'appendRow', async () => {});
  const app = isolatedApp(false);
  for (let i = 1; i <= 5; i += 1) {
    assert.equal(await post(app, { peer: PROXY, forwarded: `198.51.100.${i}` }), 200);
  }
  assert.equal(await post(app, { peer: PROXY, forwarded: '198.51.100.99' }), 429);
});

test('with one trusted hop, clients behind the proxy get separate buckets', async (t) => {
  t.mock.method(Sheets, 'appendRow', async () => {});
  const app = isolatedApp(1);
  for (let i = 1; i <= 5; i += 1) {
    assert.equal(await post(app, { peer: PROXY, forwarded: '198.51.100.1' }), 200);
  }
  assert.equal(await post(app, { peer: PROXY, forwarded: '198.51.100.1' }), 429);
  assert.equal(await post(app, { peer: PROXY, forwarded: '198.51.100.2' }), 200);
});

test('a client cannot escape its bucket by spoofing the leftmost X-Forwarded-For entry', async (t) => {
  t.mock.method(Sheets, 'appendRow', async () => {});
  const app = isolatedApp(1);
  // The proxy appends the real client address; the client controls only the entries before it.
  for (let i = 1; i <= 5; i += 1) {
    assert.equal(await post(app, { peer: PROXY, forwarded: `203.0.113.${i}, 198.51.100.7` }), 200);
  }
  assert.equal(await post(app, { peer: PROXY, forwarded: '203.0.113.200, 198.51.100.7' }), 429);
});

test('limiter state is per router instance', async (t) => {
  t.mock.method(Sheets, 'appendRow', async () => {});
  const first = isolatedApp(false);
  for (let i = 1; i <= 5; i += 1) await post(first, { peer: '192.0.2.50' });
  assert.equal(await post(first, { peer: '192.0.2.50' }), 429);
  assert.equal(await post(isolatedApp(false), { peer: '192.0.2.50' }), 200);
});
