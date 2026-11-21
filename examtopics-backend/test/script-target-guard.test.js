const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  assertDatabaseTarget,
  parseMongoUri,
  stripGuardArgs,
  TargetGuardError,
} = require('../scripts/lib/targetGuard');

const REMOTE_URI = 'mongodb+srv://private-user:private-password@cluster0.example.net/examtopics?retryWrites=true';
const LOCAL_URI = 'mongodb://private-user:private-password@127.0.0.1:27017/examtopics_dev?authSource=admin';

function guard(options) {
  const lines = [];
  const result = assertDatabaseTarget({ log: (line) => lines.push(line), env: {}, ...options });
  return { result, output: lines.join('\n') };
}

test('parses hosts and database without keeping credentials', () => {
  assert.deepEqual(parseMongoUri(REMOTE_URI), { scheme: 'mongodb+srv', hosts: ['cluster0.example.net'], database: 'examtopics', discoversMembers: false });
  assert.deepEqual(parseMongoUri('mongodb://a:27017,B:27018/'), { scheme: 'mongodb', hosts: ['a:27017', 'b:27018'], database: 'test', discoversMembers: false });
  for (const uri of [undefined, '', '   ', 'http://localhost/db', 'mongodb://']) {
    assert.throws(() => parseMongoUri(uri), TargetGuardError);
  }
});

test('local targets need no confirmation and default to a dry run', () => {
  const { result, output } = guard({ uri: LOCAL_URI, write: true });
  assert.equal(result.local, true);
  assert.equal(result.apply, false);
  assert.match(output, /"examtopics_dev" on a local host \(dry run\)/);
  assert.equal(guard({ uri: 'mongodb://[::1]:27017/x', argv: ['--apply'], write: true }).result.apply, true);
  assert.equal(guard({ uri: 'mongodb://localhost/x', argv: ['--apply'], write: false }).result.apply, false);
});

test('remote and +srv targets require a matching --target confirmation', () => {
  assert.throws(() => guard({ uri: REMOTE_URI, write: true }), /--target=<hosts>\/<database>/);
  assert.throws(() => guard({ uri: REMOTE_URI, argv: ['--target=cluster0.example.net/other'], write: true }), TargetGuardError);
  // mongodb+srv is always remote, even when the host name looks local.
  assert.throws(() => guard({ uri: 'mongodb+srv://localhost/db', write: false }), TargetGuardError);
  const { result } = guard({ uri: REMOTE_URI, argv: ['--target=cluster0.example.net/examtopics', '--apply'], write: true });
  assert.equal(result.local, false);
  assert.equal(result.apply, true);
  // Hosts compare case-insensitively; database names stay case-sensitive.
  assert.equal(guard({ uri: REMOTE_URI, argv: ['--target=Cluster0.Example.NET/examtopics'], write: false }).result.local, false);
  assert.throws(() => guard({ uri: REMOTE_URI, argv: ['--target=cluster0.example.net/ExamTopics'], write: false }), TargetGuardError);
});

test('spoofed or member-discovering local-looking URIs are treated as remote', () => {
  for (const uri of [
    'mongodb://localhost.evil.example/db',
    'mongodb://127.0.0.1.nip.io/db',
    'mongodb://user@evil.example/?x=@localhost',
    'mongodb://u:p@ss@evil.example/db',
    'mongodb://localhost,evil.example/db',
    'mongodb://localhost:27017/db?replicaSet=rs0',
    'mongodb://localhost:27017/db?loadBalanced=true',
  ]) {
    assert.throws(() => guard({ uri, write: false }), TargetGuardError, uri);
  }
  for (const uri of [
    'mongodb://LOCALHOST:27017/db',
    'mongodb://localhost:27017/db?replicaSet=rs0&directConnection=true',
  ]) {
    assert.equal(guard({ uri, write: false }).result.local, true, uri);
  }
});

test('remote targets are refused in production unless explicitly allowed', () => {
  const argv = ['--target=cluster0.example.net/examtopics'];
  assert.throws(() => guard({ uri: REMOTE_URI, argv, env: { NODE_ENV: 'production' }, write: false }), /NODE_ENV=production/);
  assert.equal(guard({ uri: REMOTE_URI, argv, env: { NODE_ENV: 'production', ALLOW_REMOTE_MIGRATION: '1' }, write: false }).result.local, false);
  assert.equal(guard({ uri: LOCAL_URI, env: { NODE_ENV: 'production' }, write: false }).result.local, true);
});

test('output and errors never contain credentials or hosts', () => {
  const { output } = guard({ uri: REMOTE_URI, argv: ['--target=cluster0.example.net/examtopics'], write: true });
  let message = '';
  try { guard({ uri: REMOTE_URI, write: true }); } catch (error) { message = error.message; }
  for (const text of [output, message]) {
    assert.doesNotMatch(text, /private-user|private-password|cluster0/);
  }
});

test('guard arguments are removed before positional parsing', () => {
  assert.deepEqual(stripGuardArgs(['file.json', '--target=h/db', '--apply']), ['file.json', '--apply']);
});

// Script-level checks: run each real script with mongoose.connect and dotenv stubbed,
// so no real database or local .env is ever used.
function runScript(script, { argv = [], env = {}, stubs = '' } = {}) {
  const scriptPath = path.join(__dirname, '../scripts', script);
  const bootstrap = `
    require('dotenv').config = () => ({ parsed: {} });
    const mongoose = require('mongoose');
    mongoose.connect = async () => {
      process.stdout.write('CONNECT_ATTEMPT autoIndex=' + mongoose.get('autoIndex') + ' autoCreate=' + mongoose.get('autoCreate') + '\\n');
      if (!process.env.FIXTURE_ALLOW_CONNECT) throw new Error('fixture refuses connections');
      return mongoose;
    };
    mongoose.disconnect = async () => {};
    ${stubs}
    process.argv = [process.execPath, ${JSON.stringify(scriptPath)}, ...${JSON.stringify(argv)}];
    require('node:module').runMain();
  `;
  const childEnv = { ...process.env, ...env };
  for (const name of ['MONGO_URI', 'NODE_ENV', 'ALLOW_REMOTE_MIGRATION', 'FIXTURE_ALLOW_CONNECT']) {
    if (!(name in env)) delete childEnv[name];
  }
  const result = spawnSync(process.execPath, ['-e', bootstrap], {
    cwd: path.join(__dirname, '..'), encoding: 'utf8', timeout: 20000, env: childEnv,
  });
  const output = `${result.stdout}\n${result.stderr}`;
  return { ...result, output, connects: (result.stdout.match(/CONNECT_ATTEMPT/g) || []).length };
}

const writeScripts = ['migrate-samples.js', 'migrate-progress.js', 'migrate-exam-visibility.js'];

for (const script of writeScripts) {
  test(`${script} refuses a missing or unconfirmed remote target before connecting`, () => {
    const missing = runScript(script);
    assert.equal(missing.connects, 0, missing.output);
    assert.equal(missing.status, 1, missing.output);
    assert.match(missing.output, /MONGO_URI/);

    const remote = runScript(script, { argv: ['--apply'], env: { MONGO_URI: REMOTE_URI } });
    assert.equal(remote.connects, 0, remote.output);
    assert.equal(remote.status, 1, remote.output);
    assert.match(remote.output, /--target=<hosts>\/<database>/);
    assert.doesNotMatch(remote.output, /private-user|private-password|cluster0/);

    const production = runScript(script, {
      argv: ['--apply', '--target=cluster0.example.net/examtopics'],
      env: { MONGO_URI: REMOTE_URI, NODE_ENV: 'production' },
    });
    assert.equal(production.connects, 0, production.output);
    assert.equal(production.status, 1, production.output);
  });

  test(`${script} connects once to a confirmed local target`, () => {
    const result = runScript(script, { env: { MONGO_URI: LOCAL_URI } });
    assert.equal(result.connects, 1, result.output);
    assert.doesNotMatch(result.output, /private-user|private-password/);
  });
}

test('backfill-question-ownership refuses unconfirmed or production remote targets before reading or connecting', () => {
  const manifest = path.join(__dirname, 'does-not-exist.json');
  const unconfirmed = runScript('backfill-question-ownership.js', { argv: [manifest, '--apply'], env: { MONGO_URI: REMOTE_URI } });
  assert.equal(unconfirmed.connects, 0, unconfirmed.output);
  assert.equal(unconfirmed.status, 1, unconfirmed.output);
  assert.match(unconfirmed.output, /--target=<hosts>\/<database>/);
  assert.doesNotMatch(unconfirmed.output, /Manifest file not found|private-user|private-password|cluster0/);

  const production = runScript('backfill-question-ownership.js', {
    argv: [manifest, '--target=cluster0.example.net/examtopics'],
    env: { MONGO_URI: REMOTE_URI, NODE_ENV: 'production' },
  });
  assert.equal(production.connects, 0, production.output);
  assert.equal(production.status, 1, production.output);
  assert.match(production.output, /NODE_ENV=production/);
});

test('export-question-ownership refuses unconfirmed or production remote targets before connecting', () => {
  const stubs = `
    const fsp = require('node:fs/promises');
    const realReadFile = fsp.readFile;
    fsp.readFile = (file, ...args) => /[\\\\/]\\.env$/.test(String(file))
      ? Promise.resolve(Buffer.from(${JSON.stringify(`MONGO_URI=${REMOTE_URI}`)}))
      : realReadFile(file, ...args);
  `;
  const output = path.join(__dirname, 'never-written.json');
  const unconfirmed = runScript('export-question-ownership.js', { argv: [output, '--diagnose'], stubs });
  assert.equal(unconfirmed.connects, 0, unconfirmed.output);
  assert.equal(unconfirmed.status, 1, unconfirmed.output);
  assert.match(unconfirmed.output, /--target=<hosts>\/<database>/);
  assert.doesNotMatch(unconfirmed.output, /private-user|private-password|cluster0/);

  const production = runScript('export-question-ownership.js', {
    argv: [output, '--diagnose', '--target=cluster0.example.net/examtopics'],
    env: { NODE_ENV: 'production' },
    stubs,
  });
  assert.equal(production.connects, 0, production.output);
  assert.equal(production.status, 1, production.output);
  assert.match(production.output, /NODE_ENV=production/);
});

test('migrate-exam-visibility writes only with --apply', () => {
  const stubs = `
    const Exam = require('./models/Exam');
    Exam.countDocuments = async () => 2;
    Exam.updateMany = async () => { process.stdout.write('WRITE\\n'); return { matchedCount: 2, modifiedCount: 2 }; };
  `;
  const env = { MONGO_URI: LOCAL_URI, FIXTURE_ALLOW_CONNECT: '1' };
  const dryRun = runScript('migrate-exam-visibility.js', { env, stubs });
  assert.equal(dryRun.status, 0, dryRun.output);
  assert.doesNotMatch(dryRun.output, /WRITE/);
  assert.match(dryRun.output, /"wouldModify": 2/);
  // A dry run must not let Mongoose build indexes or create collections.
  assert.match(dryRun.output, /CONNECT_ATTEMPT autoIndex=false autoCreate=false/);

  const apply = runScript('migrate-exam-visibility.js', { argv: ['--apply'], env, stubs });
  assert.equal(apply.status, 0, apply.output);
  assert.match(apply.output, /WRITE/);
  assert.doesNotMatch(apply.output, /autoIndex=false/);
});

test('migrate-progress writes only with --apply', () => {
  const stubs = `
    const Progress = require('./models/Progress');
    Progress.find = async () => [{
      userId: 'u1', examId: 'e1',
      answers: new Map([['3', { selectedAnswers: ['A'], isCorrect: true }]]),
      markedForTraining: [4],
      save: async () => { process.stdout.write('WRITE\\n'); },
    }];
  `;
  const env = { MONGO_URI: LOCAL_URI, FIXTURE_ALLOW_CONNECT: '1' };
  const dryRun = runScript('migrate-progress.js', { env, stubs });
  assert.doesNotMatch(dryRun.output, /WRITE/);
  assert.match(dryRun.output, /CONNECT_ATTEMPT autoIndex=false autoCreate=false/);
  assert.match(dryRun.output, /Dry run: 1 documents would be migrated/);

  const apply = runScript('migrate-progress.js', { argv: ['--apply'], env, stubs });
  assert.match(apply.output, /WRITE/);
});

test('migrate-samples dry run reads metadata but performs no writes', () => {
  const stubs = `
    const Exam = require('./models/Exam');
    const Question = require('./models/Question');
    const write = async () => { process.stdout.write('WRITE\\n'); };
    Exam.findOne = async () => null;
    Exam.findByIdAndDelete = write;
    Exam.prototype.save = write;
    Question.deleteMany = write;
    Question.insertMany = write;
  `;
  const result = runScript('migrate-samples.js', { env: { MONGO_URI: LOCAL_URI, FIXTURE_ALLOW_CONNECT: '1' }, stubs });
  assert.equal(result.status, 0, result.output);
  assert.doesNotMatch(result.output, /WRITE/);
  assert.match(result.output, /CONNECT_ATTEMPT autoIndex=false autoCreate=false/);
  assert.match(result.output, /\[dry run\] Would import/);
  assert.match(result.output, /Dry run complete/);
});
