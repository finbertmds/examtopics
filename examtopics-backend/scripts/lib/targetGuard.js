// Shared guard for scripts that connect to MongoDB (SEC-021).
// It runs before any connection and makes the target database explicit:
// - MONGO_URI is required (no silent defaults).
// - The target database name is printed; credentials and hosts are not.
// - Remote (non-loopback or mongodb+srv) targets require --target=<hosts>/<db>
//   to match the URI, and are refused when NODE_ENV=production unless
//   ALLOW_REMOTE_MIGRATION=1 is also set.
// - Write scripts run as a dry run unless --apply is passed.

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

class TargetGuardError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TargetGuardError';
  }
}

function hostnameOf(host) {
  if (host.startsWith('[')) return host.slice(1, host.indexOf(']'));
  return host.split(':')[0];
}

function parseMongoUri(uri) {
  if (typeof uri !== 'string' || !uri.trim()) {
    throw new TargetGuardError('Set MONGO_URI explicitly for the intended database.');
  }
  const match = /^(mongodb(?:\+srv)?):\/\/(?:[^@/?#]*@)?([^/?#]+)(?:\/([^?#]*))?/i.exec(uri.trim());
  if (!match) {
    throw new TargetGuardError('MONGO_URI must be a mongodb:// or mongodb+srv:// connection string.');
  }
  const [, scheme, hostPart, databasePart = ''] = match;
  const query = new URLSearchParams(uri.trim().split('?')[1]?.split('#')[0] || '');
  const option = (name) => [...query.entries()].find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1];
  // A seed list or load balancer can lead the driver to other (possibly remote) members.
  const discoversMembers = (option('replicaSet') !== undefined || String(option('loadBalanced')).toLowerCase() === 'true') &&
    String(option('directConnection')).toLowerCase() !== 'true';
  const hosts = hostPart.split(',').map((host) => host.trim().toLowerCase()).filter(Boolean);
  let database;
  try {
    database = decodeURIComponent(databasePart);
  } catch {
    throw new TargetGuardError('MONGO_URI has an invalid database name.');
  }
  if (!hosts.length) throw new TargetGuardError('MONGO_URI has no host.');
  return { scheme: scheme.toLowerCase(), hosts, database: database || 'test', discoversMembers };
}

// Note: a loopback tunnel or port-forward to a remote server still looks local.
// Do not tunnel shared databases to localhost when running these scripts.
function isLocalTarget({ scheme, hosts, discoversMembers }) {
  return scheme === 'mongodb' && !discoversMembers && hosts.every((host) => LOCAL_HOSTNAMES.has(hostnameOf(host)));
}

function readFlag(argv, name) {
  const prefix = `--${name}=`;
  const value = argv.find((arg) => arg.startsWith(prefix));
  return value === undefined ? undefined : value.slice(prefix.length);
}

// Host names are case-insensitive; database names are not.
function normalizeTargetFlag(value) {
  if (value === undefined) return undefined;
  const slash = value.lastIndexOf('/');
  if (slash === -1) return value.toLowerCase();
  return `${value.slice(0, slash).toLowerCase()}${value.slice(slash)}`;
}

function stripGuardArgs(argv) {
  return argv.filter((arg) => !arg.startsWith('--target='));
}

/**
 * Validate the database target before connecting.
 * @param {object} options
 * @param {string} options.uri MongoDB connection string.
 * @param {string[]} [options.argv] Script arguments (without node and script path).
 * @param {object} [options.env] Environment (defaults to process.env).
 * @param {boolean} options.write Whether the script writes to the database.
 * @param {(message: string) => void} [options.log] Output for the target summary.
 * @returns {{scheme: string, hosts: string[], database: string, label: string, local: boolean, apply: boolean}}
 */
function assertDatabaseTarget({ uri, argv = [], env = process.env, write, log = console.log }) {
  const target = parseMongoUri(uri);
  const label = `${target.hosts.join(',')}/${target.database}`;
  const local = isLocalTarget(target);
  const apply = Boolean(write) && argv.includes('--apply');
  const mode = !write ? 'read-only' : apply ? 'APPLY' : 'dry run';

  // Host names count as connection details (SEC-016), so only the database name is printed.
  log(`Database target: "${target.database}" on a ${local ? 'local' : 'remote'} host (${mode})`);

  if (!local) {
    if (normalizeTargetFlag(readFlag(argv, 'target')) !== label) {
      throw new TargetGuardError('Remote database target. Confirm it with --target=<hosts>/<database>, matching the hosts (comma-separated, with ports as written) and database in MONGO_URI.');
    }
    if (env.NODE_ENV === 'production' && env.ALLOW_REMOTE_MIGRATION !== '1') {
      throw new TargetGuardError('Refusing a remote database target while NODE_ENV=production. Set ALLOW_REMOTE_MIGRATION=1 only for an approved operation.');
    }
  }
  if (write && !apply) log('Dry run: no changes will be written. Re-run with --apply to write.');

  return { ...target, label, local, apply };
}

// Mongoose builds indexes and creates collections on connect by default.
// A dry run must not change the database, so disable both before connecting.
function applyDryRunConnectionDefaults(mongoose, target) {
  if (target.apply) return;
  mongoose.set('autoIndex', false);
  mongoose.set('autoCreate', false);
}

module.exports = {
  assertDatabaseTarget,
  applyDryRunConnectionDefaults,
  parseMongoUri,
  isLocalTarget,
  stripGuardArgs,
  TargetGuardError,
};
