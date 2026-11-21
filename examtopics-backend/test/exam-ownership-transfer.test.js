const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

const Exam = require('../models/Exam');
const User = require('../models/User');
const examService = require('../services/examService');
const examController = require('../controllers/examController');

const ownerId = new mongoose.Types.ObjectId();
const newOwnerId = new mongoose.Types.ObjectId();
const examId = new mongoose.Types.ObjectId();

function mockTransfer(t, { exam = { _id: examId, code: 'aws-saa', createdBy: String(ownerId) }, user = { _id: newOwnerId }, updated } = {}) {
  const calls = { lookups: [], updates: [] };
  t.mock.method(Exam, 'findOne', async (filter) => exam && filter.code === exam.code ? exam : null);
  t.mock.method(User, 'findByEmail', async (email) => {
    calls.lookups.push(email);
    return user;
  });
  t.mock.method(Exam, 'findOneAndUpdate', async (filter, update) => {
    calls.updates.push({ filter, update });
    return updated === undefined ? { ...exam, createdBy: String(user?._id) } : updated;
  });
  return calls;
}

test('the owner can transfer an exam; the write is conditional on the current owner', async (t) => {
  const calls = mockTransfer(t);
  const result = await examService.transferExamOwnership('aws-saa', String(ownerId), '  New.Owner@Example.com ');

  assert.equal(result.exam.createdBy, String(newOwnerId));
  assert.deepEqual(calls.lookups, ['new.owner@example.com']);
  assert.equal(calls.updates.length, 1);
  assert.deepEqual(calls.updates[0].filter, { _id: examId, createdBy: String(ownerId) });
  assert.deepEqual(calls.updates[0].update, { $set: { createdBy: newOwnerId } });
});

test('a non-owner or anonymous caller cannot transfer an exam', async (t) => {
  const calls = mockTransfer(t);
  assert.deepEqual(await examService.transferExamOwnership('aws-saa', String(newOwnerId), 'x@example.com'), { error: 'Forbidden' });
  assert.deepEqual(await examService.transferExamOwnership('aws-saa', undefined, 'x@example.com'), { error: 'Forbidden' });
  assert.equal(calls.lookups.length, 0);
  assert.equal(calls.updates.length, 0);
});

test('unknown exams, unknown users and self-transfer are rejected without writing', async (t) => {
  let calls = mockTransfer(t);
  assert.deepEqual(await examService.transferExamOwnership('missing', String(ownerId), 'x@example.com'), { error: 'ExamNotFound' });
  t.mock.restoreAll();

  calls = mockTransfer(t, { user: null });
  assert.deepEqual(await examService.transferExamOwnership('aws-saa', String(ownerId), 'x@example.com'), { error: 'UserNotFound' });
  assert.equal(calls.updates.length, 0);
  t.mock.restoreAll();

  calls = mockTransfer(t, { user: { _id: ownerId } });
  assert.deepEqual(await examService.transferExamOwnership('aws-saa', String(ownerId), 'me@example.com'), { error: 'AlreadyOwner' });
  assert.equal(calls.updates.length, 0);
});

test('a concurrent ownership change makes the transfer fail closed', async (t) => {
  mockTransfer(t, { updated: null });
  assert.deepEqual(await examService.transferExamOwnership('aws-saa', String(ownerId), 'x@example.com'), { error: 'Forbidden' });
});

function response() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('the transfer endpoint validates the email and maps service results to status codes', async (t) => {
  const transfer = t.mock.method(examService, 'transferExamOwnership', async () => ({ exam: { code: 'aws-saa' } }));
  const call = async (body, user = { userId: String(ownerId) }) => {
    const res = response();
    await examController.transferExamOwnership({ params: { code: 'aws-saa' }, body, user }, res, (error) => { throw error; });
    return res;
  };

  for (const body of [{}, { email: 'not-an-email' }, { email: { $ne: null } }, undefined]) {
    const res = await call(body);
    assert.equal(res.statusCode, 400, JSON.stringify(body));
    assert.equal(res.body.error, 'InvalidEmail');
  }
  assert.equal(transfer.mock.callCount(), 0);

  const ok = await call({ email: 'new@example.com' });
  assert.equal(ok.statusCode, 200);
  assert.deepEqual(ok.body, { success: true, exam: { code: 'aws-saa' } });
  assert.deepEqual(transfer.mock.calls[0].arguments, ['aws-saa', String(ownerId), 'new@example.com']);

  for (const [error, status] of [['ExamNotFound', 404], ['UserNotFound', 404], ['Forbidden', 403], ['AlreadyOwner', 400]]) {
    transfer.mock.mockImplementation(async () => ({ error }));
    const res = await call({ email: 'new@example.com' });
    assert.equal(res.statusCode, status, error);
    assert.deepEqual(res.body, { success: false, error });
  }
});
