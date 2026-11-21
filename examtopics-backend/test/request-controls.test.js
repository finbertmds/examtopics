const test = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { IncomingMessage, ServerResponse } = require('node:http');
const { PassThrough } = require('node:stream');

process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'https://stage.example.test';
process.env.GOOGLE_CLIENT_ID = 'oauth-test-client';
process.env.GOOGLE_CLIENT_SECRET = randomBytes(32).toString('hex');

const { generateToken } = require('../services/authService');
const Sheets = require('../services/sheetsService');
const AuthSession = require('../models/AuthSession');
const app = require('../index');

const user = { _id: 'local-user', email: 'verified@example.test', name: 'Verified' };
function fixtureBearer(t) {
  const session = {
    _id: randomBytes(32).toString('base64url'),
    userId: user._id,
    expiresAt: new Date(Date.now() + 60_000),
  };
  t.mock.method(AuthSession, 'findOne', async ({ _id }) => _id === session._id ? session : null);
  return generateToken(user, session);
}

const report = { examId: 'saa-c03', topicNumber: 1, questionNumber: 2, reason: 'Other' };

function request({ url, body, token, ip = '192.0.2.10', forwarded = '192.0.2.20' }) {
  return new Promise((resolve, reject) => {
    const socket = new PassThrough();
    socket.remoteAddress = ip;
    const req = new IncomingMessage(socket);
    req.complete = true;
    req.method = 'POST';
    req.url = url;
    req.headers = {
      'content-type': 'application/json',
      'content-length': String(Buffer.byteLength(body)),
      'x-forwarded-for': forwarded,
      origin: 'https://stage.example.test',
      'x-examtopics-session': '1',
    };
    if (token) req.headers.authorization = `Bearer ${token}`;
    req.push(Buffer.from(body));
    req.push(null);
    const res = new ServerResponse(req);
    res.end = (payload) => resolve({ status: res.statusCode, body: payload, headers: res.getHeaders() });
    app.handle(req, res, reject);
  });
}

test('report parser rejects oversized and malformed input without reflecting it', async (t) => {
  t.mock.method(Sheets, 'appendRow', () => assert.fail('Invalid report should not reach Google Sheets'));
  const errors = [];
  t.mock.method(console, 'error', (...args) => errors.push(args));
  const url = '/report';
  assert.equal((await request({ url, body: JSON.stringify({ ...report, comment: 'a'.repeat(4096) }) })).status, 413);
  const malformed = await request({ url, body: '{"fixture":"private report text"' });
  assert.equal(malformed.status, 400);
  assert.doesNotMatch(malformed.body.toString(), /private report text/);
  assert.doesNotMatch(JSON.stringify(errors), /private report text/);
});

test('authentication runs before exam import parsing and large limits apply only to imports', async (t) => {
  const body = JSON.stringify({ fixture: 'a'.repeat(600_000) });
  const token = fixtureBearer(t);
  assert.equal((await request({ url: '/api/exams', body: '{' })).status, 401);
  const imported = await request({ url: '/api/exams', body, token });
  // The large body was parsed; validation then rejects it (ARCH-003: 400, not 200).
  assert.equal(imported.status, 400);
  assert.equal(JSON.parse(imported.body).success, false);
  assert.equal((await request({ url: '/auth/exchange', body, token })).status, 413);
});

test('report identity and link come from authenticated claims and server configuration', async (t) => {
  const rows = [];
  t.mock.method(Sheets, 'appendRow', (row) => rows.push(row));
  const url = '/report';
  const body = JSON.stringify({ ...report, user: 'caller@example.test', url: 'https://caller.example.test' });
  assert.equal((await request({ url, body, ip: '192.0.2.12' })).status, 200);
  assert.equal((await request({ url, body, ip: '192.0.2.13', token: fixtureBearer(t) })).status, 200);
  assert.deepEqual(rows.map((row) => row.user), ['', 'verified@example.test']);
  assert.equal(rows[1].url, 'https://stage.example.test/exam/saa-c03?topicNumber=1&questionNumber=2');
});

test('report attempts are capped by socket client and by process', async (t) => {
  const now = Date.now() + 60_000;
  let elapsed = 0;
  t.mock.method(Date, 'now', () => now + elapsed);
  t.mock.method(Sheets, 'appendRow', async () => {});
  const url = '/report';
  const body = JSON.stringify(report);
  for (let i = 1; i <= 5; i += 1) {
    assert.equal((await request({ url, body, ip: '192.0.2.1' })).status, 200);
  }
  const clientLimited = await request({ url, body, ip: '192.0.2.1', forwarded: '192.0.2.99' });
  assert.equal(clientLimited.status, 429);
  assert.equal(clientLimited.headers['retry-after'], '60');
  for (let i = 2; i <= 26; i += 1) {
    assert.equal((await request({ url, body, ip: `192.0.2.${i}` })).status, 200);
  }
  assert.equal((await request({ url, body, ip: '192.0.2.27' })).status, 429);
  elapsed = 60_000;
  assert.equal((await request({ url, body, ip: '192.0.2.27' })).status, 200);
});
