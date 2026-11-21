const { createHash, randomBytes } = require('node:crypto');
const { IDLE_MS, ABSOLUTE_MS } = require('../config/auth');
const AuthSession = require('../models/AuthSession');
const User = require('../models/User');
const isOAuthValue = require('../utils/isOAuthValue');
const getFrontendUrl = require('../utils/frontendUrl');


const secure = process.env.NODE_ENV === 'production' || new URL(getFrontendUrl()).protocol === 'https:';
const cookieName = secure ? '__Host-examtopics-session' : 'examtopics-session';
const cookieOptions = { httpOnly: true, secure, sameSite: secure ? 'none' : 'lax', partitioned: secure, path: '/' };
const digest = (value) => createHash('sha256').update(value).digest('base64url');

function getCookieSessionId(req) {
  const matches = req.headers.cookie?.split(';')
    .map(value => value.trim())
    .filter(value => value.startsWith(`${cookieName}=`));
  const value = matches?.length === 1 ? matches[0].slice(cookieName.length + 1) : undefined;
  return isOAuthValue(value) ? digest(value) : null;
}

async function createSession(req, res, userId) {
  const value = randomBytes(32).toString('base64url');
  const now = Date.now();
  const previousId = getCookieSessionId(req);
  if (previousId) await AuthSession.deleteOne({ _id: previousId });
  const session = await AuthSession.create({
    _id: digest(value),
    userId,
    lastActivityAt: new Date(now),
    absoluteExpiresAt: new Date(now + ABSOLUTE_MS),
    expiresAt: new Date(now + IDLE_MS),
  });
  res.cookie(cookieName, value, { ...cookieOptions, expires: session.absoluteExpiresAt });
  return session;
}

function activeFilter(id, now) {
  return { _id: id, expiresAt: { $gt: new Date(now) }, absoluteExpiresAt: { $gt: new Date(now) } };
}

function findActive(id, now = Date.now()) {
  return AuthSession.findOne(activeFilter(id, now));
}

function findSessionUser(session) {
  return User.findById(session.userId);
}

async function touchSession(session, now) {
  return AuthSession.findOneAndUpdate(activeFilter(session._id, now), {
    $max: {
      lastActivityAt: new Date(now),
      expiresAt: new Date(Math.min(now + IDLE_MS, session.absoluteExpiresAt.getTime())),
    },
  }, { returnDocument: 'after' });
}

async function revokeSession(req, res, bearer) {
  const cookieSessionId = getCookieSessionId(req);
  if (bearer) {
    await AuthSession.deleteOne({ _id: bearer.sid, userId: bearer.userId });
    if (cookieSessionId && cookieSessionId !== bearer.sid) return;
  } else if (cookieSessionId) {
    await AuthSession.deleteOne({ _id: cookieSessionId });
  }
  res.clearCookie(cookieName, cookieOptions);
}

module.exports = {
  createSession,
  findActive,
  findSessionUser,
  getCookieSessionId,
  touchSession,
  revokeSession,
};
