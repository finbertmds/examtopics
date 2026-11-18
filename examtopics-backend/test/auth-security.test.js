const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { createHash, randomBytes } = require('node:crypto');
const { IncomingMessage, ServerResponse } = require('node:http');
const express = require('express');
const jwt = require('jsonwebtoken');

process.env.GOOGLE_CLIENT_ID = 'oauth-test-client';
process.env.GOOGLE_CLIENT_SECRET = randomBytes(32).toString('hex');
process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = randomBytes(32).toString('hex');
process.env.SESSION_SECRET = randomBytes(32).toString('hex');
process.env.GOOGLE_CALLBACK_URL = 'https://api.example.test/auth/google/callback';
process.env.FRONTEND_URL = 'https://app.example.test';

const { passport } = require('../services/authService');
const authRoutes = require('../routes/authRoutes');
const AuthSession = require('../models/AuthSession');

function loadProductionAuth(overrides) {
  return spawnSync(process.execPath, ['-e', 'require(process.argv[1])', require.resolve('../services/authService')], {
    encoding: 'utf8',
    env: { ...process.env, DOTENV_PATH: '/dev/null', ...overrides },
  });
}

test('production startup requires a JWT signing key', () => {
  const result = loadProductionAuth({ JWT_SECRET: '' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /JWT_SECRET/);
});

test('production startup requires a key for OAuth state', () => {
  const result = loadProductionAuth({ SESSION_SECRET: '' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /SESSION_SECRET/);
});

test('production startup rejects documented secret placeholders', () => {
  for (const [name, placeholder] of [
    ['JWT_SECRET', 'your-jwt-secret-key-change-in-production'],
    ['SESSION_SECRET', 'your-session-secret-key'],
  ]) {
    const result = loadProductionAuth({ [name]: placeholder });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(name));
  }
});

test('production startup accepts configured keys', () => {
  assert.equal(loadProductionAuth({}).status, 0);
});

function request(app, url, headers = {}, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    const req = new IncomingMessage({});
    req.method = method;
    req.url = url;
    req.headers = headers;
    req.body = body;
    const res = new ServerResponse(req);
    res.end = (body) => {
      res.testBody = body;
      resolve(res);
    };
    app.handle(req, res, reject);
  });
}

const DAY_MS = 24 * 60 * 60 * 1000;
const user = { _id: 'test-user', email: 'candidate@example.test', name: 'Candidate' };

function authApp() {
  const app = express();
  app.use('/auth', authRoutes);
  app.use((req, res) => res.status(404).end());
  return app;
}

const authHeaders = { origin: 'https://app.example.test', 'x-examtopics-session': '1' };

test('session endpoints require the exact frontend origin and application header', async () => {
  const app = authApp();
  for (const path of ['/session', '/activity', '/logout', '/exchange']) {
    assert.equal((await request(app, '/auth' + path, {}, 'POST')).statusCode, 403);
    assert.equal((await request(app, '/auth' + path, {
      ...authHeaders, origin: 'https://other.example.test',
    }, 'POST')).statusCode, 403);
  }
  assert.equal((await request(app, '/auth/session', authHeaders, 'POST')).statusCode, 401);
  assert.equal((await request(app, '/auth/logout', authHeaders, 'POST')).statusCode, 200);
});

test('legacy tokens cannot access protected routes or renew', async () => {
  const app = authApp();
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const headers = { authorization: `Bearer ${token}` };
  assert.equal((await request(app, '/auth/me', headers)).statusCode, 403);
  assert.equal((await request(app, '/auth/refresh', headers, 'POST')).statusCode, 404);
});

function mockSessionRecords(t) {
  const records = new Map();
  const findActive = ({ _id, expiresAt, absoluteExpiresAt }) => {
    const session = records.get(_id);
    if (session?.expiresAt > expiresAt.$gt && session.absoluteExpiresAt > absoluteExpiresAt.$gt) return { ...session };
    return null;
  };
  t.mock.method(AuthSession, 'create', async (session) => {
    records.set(session._id, session);
    return { ...session };
  });
  t.mock.method(AuthSession, 'findOne', async (filter) => findActive(filter));
  t.mock.method(AuthSession, 'findOneAndUpdate', async (filter, update, options) => {
    assert.equal(options.returnDocument, 'after');
    const session = findActive(filter);
    if (!session) return null;
    const record = records.get(filter._id);
    for (const [key, value] of Object.entries(update.$max)) {
      if (record[key] < value) record[key] = value;
    }
    return { ...record };
  });
  t.mock.method(AuthSession, 'deleteOne', async ({ _id, userId }) => {
    if (userId === undefined || records.get(_id)?.userId === userId) records.delete(_id);
  });
  return records;
}

function authPost(app, path, headers = {}) {
  return request(app, '/auth' + path, { ...authHeaders, ...headers }, 'POST');
}

async function fixtureSession(records, now) {
  const value = randomBytes(32).toString('base64url');
  const id = createHash('sha256').update(value).digest('base64url');
  const record = {
    _id: id,
    userId: user._id,
    lastActivityAt: new Date(now),
    expiresAt: new Date(now + DAY_MS),
    absoluteExpiresAt: new Date(now + 30 * DAY_MS),
  };
  records.set(id, record);
  return { cookie: `__Host-examtopics-session=${value}`, record };
}

test('restoring a session never extends idle expiry and the cutoff is enforced before cleanup', async (t) => {
  const now = Date.now();
  let clock = now;
  t.mock.method(Date, 'now', () => clock);
  const records = mockSessionRecords(t);
  t.mock.method(require('../models/User'), 'findById', async () => user);
  const { cookie, record } = await fixtureSession(records, now);
  const app = authApp();

  clock = now + DAY_MS - 60_000;
  const restored = await authPost(app, '/session', { cookie });
  assert.equal(restored.statusCode, 200);
  const payload = JSON.parse(restored.testBody);
  assert.equal(payload.idleExpiresAt, now + DAY_MS);
  assert.equal(payload.absoluteExpiresAt, now + 30 * DAY_MS);
  assert.equal(jwt.decode(payload.token).exp, Math.floor(payload.idleExpiresAt / 1000));
  assert.equal(record.lastActivityAt.getTime(), now);
  clock = now + DAY_MS;
  assert.equal((await authPost(app, '/session', { cookie })).statusCode, 401);
  assert.equal(records.has(record._id), true);
});

test('activity extends idle expiry but cannot extend the absolute deadline or another session', async (t) => {
  const now = Date.now();
  let clock = now;
  t.mock.method(Date, 'now', () => clock);
  const records = mockSessionRecords(t);
  t.mock.method(require('../models/User'), 'findById', async () => user);
  const first = await fixtureSession(records, now);
  const second = await fixtureSession(records, now);
  const app = authApp();
  const restored = await authPost(app, '/session', { cookie: first.cookie });
  const headers = { cookie: first.cookie, authorization: `Bearer ${JSON.parse(restored.testBody).token}` };

  clock = now + 60 * 60 * 1000;
  assert.equal((await authPost(app, '/activity', { ...headers, cookie: second.cookie })).statusCode, 401);
  assert.equal(second.record.lastActivityAt.getTime(), now);
  assert.equal((await authPost(app, '/activity', { cookie: first.cookie })).statusCode, 401);

  // The expired bearer is an identity binding only. The active cookie is still required.
  for (let elapsedHours = 23; elapsedHours <= 713; elapsedHours += 23) {
    clock = now + elapsedHours * 60 * 60 * 1000;
    const response = await authPost(app, '/activity', headers);
    assert.equal(response.statusCode, 200);
    assert.equal(JSON.parse(response.testBody).absoluteExpiresAt, now + 30 * DAY_MS);
  }
  assert.equal(first.record.expiresAt.getTime(), now + 30 * DAY_MS);
  clock = now + 30 * DAY_MS;
  assert.equal((await authPost(app, '/activity', headers)).statusCode, 401);
});

test('logout invalidates bearer access with a missing cookie and leaves a different cookie session intact', async (t) => {
  const now = Date.now();
  const records = mockSessionRecords(t);
  t.mock.method(require('../models/User'), 'findById', async () => user);
  const old = await fixtureSession(records, now);
  const other = await fixtureSession(records, now);
  const cookieBlocked = await fixtureSession(records, now);
  const app = authApp();
  const bearerFor = async (cookie) => {
    const restored = await authPost(app, '/session', { cookie });
    return { authorization: `Bearer ${JSON.parse(restored.testBody).token}` };
  };
  const oldBearer = await bearerFor(old.cookie);
  const blockedBearer = await bearerFor(cookieBlocked.cookie);
  assert.equal((await request(app, '/auth/me', oldBearer)).statusCode, 200);

  const mismatch = await authPost(app, '/logout', { ...oldBearer, cookie: other.cookie });
  assert.equal(mismatch.statusCode, 200);
  assert.equal(mismatch.getHeader('set-cookie'), undefined);
  assert.equal((await request(app, '/auth/me', oldBearer)).statusCode, 403);
  assert.equal((await authPost(app, '/session', { cookie: other.cookie })).statusCode, 200);

  const logout = await authPost(app, '/logout', blockedBearer);
  assert.equal(logout.statusCode, 200);
  assert.match([].concat(logout.getHeader('set-cookie'))[0], /Expires=Thu, 01 Jan 1970/);
  assert.match([].concat(logout.getHeader('set-cookie'))[0], /Partitioned/);
  assert.equal((await request(app, '/auth/me', blockedBearer)).statusCode, 403);
});

test('Google OAuth binds browser state to a short-lived one-time code exchange', async (t) => {
  const now = Date.now();
  let elapsed = 0;
  t.mock.method(Date, 'now', () => now + elapsed);
  const strategy = passport._strategy('google');
  let exchanges = 0;
  t.mock.method(strategy._oauth2, 'getOAuthAccessToken', (_code, _params, callback) => {
    exchanges += 1;
    callback(null, 'test-access-token');
  });
  t.mock.method(strategy, '_loadUserProfile', (_token, callback) => {
    callback(null, { id: 'google-test-user' });
  });
  const User = require('../models/User');
  t.mock.method(User, 'findOrCreateUser', async () => ({
    _id: 'local-test-user',
    email: 'candidate@example.test',
    name: 'Candidate',
  }));

  const app = express();
  app.use(passport.initialize());
  app.use('/auth', authRoutes);

  assert.equal((await request(app, '/auth/google')).statusCode, 400);
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const startPath = `/auth/google?challenge=${challenge}`;
  const start = await request(app, startPath);
  assert.equal(start.statusCode, 302);
  const state = new URL(start.getHeader('location')).searchParams.get('state');
  assert.ok(state);
  const [setCookie] = [].concat(start.getHeader('set-cookie'));
  assert.match(setCookie, /^__Host-/);
  assert.match(setCookie, /(?:^|; )HttpOnly(?:;|$)/i);
  assert.match(setCookie, /(?:^|; )Secure(?:;|$)/i);
  assert.match(setCookie, /(?:^|; )Path=\/(?:;|$)/i);
  assert.match(setCookie, /(?:^|; )SameSite=Lax(?:;|$)/i);
  assert.match(setCookie, /(?:^|; )Max-Age=600(?:;|$)/i);

  const query = new URLSearchParams({
    code: 'local-test-code',
    state,
    challenge: randomBytes(32).toString('base64url'),
  });
  const callback = `/auth/google/callback?${query}`;
  const withoutCookie = await request(app, callback);
  assert.equal(withoutCookie.getHeader('location'), 'https://app.example.test');
  assert.equal(exchanges, 0);

  const otherBrowser = await request(app, startPath);
  const [otherCookie] = [].concat(otherBrowser.getHeader('set-cookie'));
  const mismatch = await request(app, callback, { cookie: otherCookie.split(';')[0] });
  assert.equal(mismatch.getHeader('location'), 'https://app.example.test');
  assert.equal(exchanges, 0);

  const codes = require('../models/OAuthLoginCode');
  const sessionRecords = mockSessionRecords(t);
  const saved = new Map();
  t.mock.method(codes, 'create', async (document) => {
    saved.set(document._id, document);
  });
  t.mock.method(codes, 'findOneAndDelete', async ({ _id, challenge, expiresAt }) => {
    const document = saved.get(_id);
    if (document?.challenge !== challenge || !(document.expiresAt > expiresAt.$gt)) return null;
    saved.delete(_id);
    return document;
  });
  t.mock.method(User, 'findById', async () => user);
  const completed = await request(app, callback, { cookie: setCookie.split(';')[0] });
  assert.equal(completed.statusCode, 302);
  const destination = new URL(completed.getHeader('location'));
  assert.equal(destination.origin + destination.pathname, 'https://app.example.test/auth/callback');
  assert.equal(destination.search, '');
  const code = new URLSearchParams(destination.hash.slice(1)).get('code');
  assert.match(code, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(completed.getHeader('cache-control'), 'no-store');
  assert.equal(saved.has(code), false);
  const [expiredCookie] = [].concat(completed.getHeader('set-cookie'));
  assert.match(expiredCookie, /Expires=Thu, 01 Jan 1970/);
  assert.equal(exchanges, 1);

  const exchange = (body) => request(app, '/auth/exchange', authHeaders, 'POST', body);
  assert.equal((await exchange({ code, verifier: [] })).statusCode, 400);
  assert.equal((await exchange({ code, verifier: randomBytes(32).toString('base64url') })).statusCode, 403);
  elapsed = 60_000;
  assert.equal((await exchange({ code, verifier })).statusCode, 403);
  elapsed = 59_999;
  const responses = await Promise.all([
    exchange({ code, verifier }),
    exchange({ code, verifier }),
  ]);
  assert.deepEqual(responses.map((res) => res.statusCode).sort(), [200, 403]);
  const success = responses.find((res) => res.statusCode === 200);
  assert.equal(success.getHeader('cache-control'), 'no-store');
  const { token } = JSON.parse(success.testBody);
  const claims = jwt.decode(token);
  const [sessionCookie] = [].concat(success.getHeader('set-cookie'));
  assert.match(sessionCookie, /^__Host-examtopics-session=/);
  for (const attribute of ['HttpOnly', 'Secure', 'SameSite=None', 'Partitioned', 'Path=/']) {
    assert.ok(sessionCookie.split('; ').includes(attribute));
  }
  assert.doesNotMatch(sessionCookie, /Domain=/i);
  const rawId = sessionCookie.split(';')[0].split('=')[1];
  assert.equal(claims.sid, createHash('sha256').update(rawId).digest('base64url'));
  assert.equal(sessionRecords.has(rawId), false);
  assert.equal(claims.exp - claims.iat, 600);
  assert.equal((await request(app, '/auth/me', { authorization: `Bearer ${token}` })).statusCode, 200);

  elapsed = 11 * 60 * 1000;
  const expired = await request(app, callback, { cookie: setCookie.split(';')[0] });
  assert.equal(expired.getHeader('location'), 'https://app.example.test');
  assert.equal(exchanges, 1);
});
