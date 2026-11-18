const test = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { IncomingMessage, ServerResponse } = require('node:http');
const { PassThrough } = require('node:stream');
const { inspect } = require('node:util');

process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'oauth-test-client';
process.env.GOOGLE_CLIENT_SECRET = randomBytes(32).toString('hex');

const app = require('../index');
const { generateToken } = require('../services/authService');
const AuthSession = require('../models/AuthSession');
const Progress = require('../models/Progress');
const Sheets = require('../services/sheetsService');

const privateDetail = 'synthetic-private-driver-detail';

function request({ method = 'GET', url, token, body }) {
  return new Promise((resolve, reject) => {
    const socket = new PassThrough();
    socket.remoteAddress = '192.0.2.10';
    const req = new IncomingMessage(socket);
    req.method = method;
    req.url = url;
    req.headers = {
      'x-request-id': 'untrusted-request-id',
      'x-examtopics-session': '1',
      origin: 'http://localhost:3000',
    };
    if (token) req.headers.authorization = `Bearer ${token}`;
    if (body) {
      req.headers['content-type'] = 'application/json';
      req.headers['content-length'] = String(Buffer.byteLength(body));
      req.push(body);
      req.push(null);
      req.complete = true;
    }
    const res = new ServerResponse(req);
    res.end = (payload) => resolve({ status: res.statusCode, body: JSON.parse(payload), headers: res.getHeaders() });
    app.handle(req, res, reject);
  });
}

function captureErrors(t) {
  const logs = [];
  t.mock.method(console, 'error', (...args) => logs.push(args));
  return logs;
}

function assertRedacted(result, logs, event) {
  assert.equal(result.status, 500);
  const id = result.headers['x-request-id'];
  assert.match(id ?? '', /^[\da-f-]{36}$/);
  assert.equal(result.body.requestId, id);
  assert.equal(result.body.details, undefined);
  assert.doesNotMatch(inspect([result.body, logs]), /synthetic-private-driver-detail|untrusted-request-id/);
  assert.deepEqual(logs.map(([entry]) => JSON.parse(entry)), [{ event, requestId: id }]);
}

test('progress failures emit only a fixed message and a server-generated request ID', async (t) => {
  const logs = captureErrors(t);
  const user = { _id: 'fixture-account', email: 'candidate@example.test', name: 'Candidate' };
  const session = { _id: randomBytes(32).toString('base64url'), userId: user._id, expiresAt: new Date(Date.now() + 60_000) };
  t.mock.method(AuthSession, 'findOne', async () => session);
  t.mock.method(Progress, 'findByUserAndExam', async () => { throw new Error(privateDetail); });

  const result = await request({ url: '/progress/load/fixture-exam', token: generateToken(user, session) });
  assertRedacted(result, logs, 'progress.load_failed');
  assert.equal(result.body.error, 'Failed to load progress');
});

test('a Sheets error is correlated without leaking the exception or report text', async (t) => {
  const logs = captureErrors(t);
  t.mock.method(Sheets, 'appendRow', async () => { throw new Error(privateDetail); });
  const body = JSON.stringify({
    examId: 'fixture-exam', topicNumber: 1, questionNumber: 2, reason: 'Other', comment: 'private-report-text',
  });

  const result = await request({ url: '/report', method: 'POST', body });
  assertRedacted(result, logs, 'report.write_failed');
  assert.doesNotMatch(inspect(logs), /private-report-text/);
});
