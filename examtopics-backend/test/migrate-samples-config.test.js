const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('sample migration exits before connecting when no explicit MongoDB URI is configured', async () => {
  const filename = path.join(__dirname, '../scripts/migrate-samples.js');
  const errors = [];
  let connections = 0;
  const fakeProcess = {
    argv: [process.execPath, filename],
    env: { MONGO_URI: '' },
    exitCode: 0,
    exit(code) { this.exitCode = code; },
  };
  const modules = {
    fs,
    path,
    dotenv: { config() {} },
    mongoose: {},
    '../models/Exam': {},
    '../models/Question': {},
    './lib/targetGuard': require('../scripts/lib/targetGuard'),
    '../config/database': async () => {
      connections += 1;
      throw new Error('Fixture does not connect');
    },
  };

  await vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    require: (name) => modules[name],
    __dirname: path.dirname(filename),
    process: fakeProcess,
    console: { error: (...args) => errors.push(args.join(' ')) },
  }, { filename });

  assert.equal(connections, 0);
  assert.equal(fakeProcess.exitCode, 1);
  assert.match(errors.join('\n'), /MONGO_URI/);
});
