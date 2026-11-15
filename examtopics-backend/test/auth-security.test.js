const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const { IncomingMessage, ServerResponse } = require('node:http');
const express = require('express');

process.env.GOOGLE_CLIENT_ID = 'oauth-test-client';
process.env.GOOGLE_CLIENT_SECRET = randomBytes(32).toString('hex');
process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = randomBytes(32).toString('hex');
process.env.SESSION_SECRET = randomBytes(32).toString('hex');
process.env.GOOGLE_CALLBACK_URL = 'https://api.example.test/auth/google/callback';
process.env.FRONTEND_URL = 'https://app.example.test';

const { passport } = require('../services/authService');
const authRoutes = require('../routes/authRoutes');

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

function request(app, url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = new IncomingMessage({});
    req.method = 'GET';
    req.url = url;
    req.headers = headers;
    const res = new ServerResponse(req);
    res.end = () => resolve(res);
    app.handle(req, res, reject);
  });
}

test('Google OAuth binds a short-lived state to the browser and consumes it at callback', async (t) => {
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

  const start = await request(app, '/auth/google');
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

  const query = new URLSearchParams({ code: 'local-test-code', state });
  const callback = `/auth/google/callback?${query}`;
  const withoutCookie = await request(app, callback);
  assert.equal(withoutCookie.getHeader('location'), 'https://app.example.test');
  assert.equal(exchanges, 0);

  const otherBrowser = await request(app, '/auth/google');
  const [otherCookie] = [].concat(otherBrowser.getHeader('set-cookie'));
  const mismatch = await request(app, callback, { cookie: otherCookie.split(';')[0] });
  assert.equal(mismatch.getHeader('location'), 'https://app.example.test');
  assert.equal(exchanges, 0);

  const completed = await request(app, callback, { cookie: setCookie.split(';')[0] });
  assert.equal(completed.statusCode, 302);
  const destination = new URL(completed.getHeader('location'));
  assert.equal(destination.origin + destination.pathname, 'https://app.example.test/auth/callback');
  assert.ok(destination.searchParams.has('token'));
  const [expiredCookie] = [].concat(completed.getHeader('set-cookie'));
  assert.match(expiredCookie, /Expires=Thu, 01 Jan 1970/);
  assert.equal(exchanges, 1);

  const elevenMinutesLater = Date.now() + 11 * 60 * 1000;
  t.mock.method(Date, 'now', () => elevenMinutesLater);
  const expired = await request(app, callback, { cookie: setCookie.split(';')[0] });
  assert.equal(expired.getHeader('location'), 'https://app.example.test');
  assert.equal(exchanges, 1);
});
