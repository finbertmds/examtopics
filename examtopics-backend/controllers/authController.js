const { createHash, randomBytes } = require('node:crypto');
const { IDLE_MS } = require('../config/auth');
const { generateToken, readBearer } = require('../services/authService');
const OAuthLoginCode = require('../models/OAuthLoginCode');
const User = require('../models/User');
const getFrontendUrl = require('../utils/frontendUrl');
const sessions = require('../services/authSessionService');
const isOAuthValue = require('../utils/isOAuthValue');

const LOGIN_CODE_TTL_MS = 60 * 1000;
const sha256 = (value) => createHash('sha256').update(value).digest('base64url');

function sessionResponse(res, user, session) {
  return res.json({
    success: true,
    token: generateToken(user, session),
    user: { id: String(user._id), email: user.email, name: user.name, picture: user.picture || null },
    idleExpiresAt: session.lastActivityAt.getTime() + IDLE_MS,
    absoluteExpiresAt: session.absoluteExpiresAt.getTime(),
  });
}

function sessionUnavailable(res) {
  return res.status(401).json({ success: false, error: 'Session missing or expired' });
}

async function restore(req, res, touch) {
  const id = sessions.getCookieSessionId(req);
  if (!id) return sessionUnavailable(res);

  // An old tab must never extend a different account's session after a new login.
  const bearer = touch ? readBearer(req, { ignoreExpiration: true }) : null;
  if (touch && bearer?.sid !== id) return sessionUnavailable(res);
  const now = Date.now();
  let session = await sessions.findActive(id, now);
  if (!session || (touch && String(session.userId) !== bearer.userId)) return sessionUnavailable(res);

  const user = await User.findById(session.userId);
  if (!user) return sessionUnavailable(res);
  if (touch) {
    session = await sessions.touchSession(session, now);
    if (!session) return sessionUnavailable(res);
  }
  if (session.expiresAt.getTime() <= Date.now()) return sessionUnavailable(res);
  return sessionResponse(res, user, session);
}

class AuthController {
  async googleCallback(req, res) {
    const code = randomBytes(32).toString('base64url');
    await OAuthLoginCode.create({
      _id: sha256(code),
      challenge: req.oauthChallenge,
      userId: req.user._id,
      expiresAt: new Date(Date.now() + LOGIN_CODE_TTL_MS),
    });
    res.redirect(`${getFrontendUrl()}/auth/callback#code=${code}`);
  }

  async exchangeLoginCode(req, res) {
    const { code, verifier } = req.body ?? {};
    if (!isOAuthValue(code) || !isOAuthValue(verifier)) {
      return res.status(400).json({ success: false, error: 'Valid login code and verifier required' });
    }

    const grant = await OAuthLoginCode.findOneAndDelete({
      _id: sha256(code),
      challenge: sha256(verifier),
      expiresAt: { $gt: new Date(Date.now()) },
    });
    const user = grant && await User.findById(grant.userId);
    if (!user) {
      return res.status(403).json({ success: false, error: 'Invalid or expired login code' });
    }
    const session = await sessions.createSession(req, res, user._id);
    return sessionResponse(res, user, session);
  }

  getCurrentUser(req, res) {
    res.json({
      success: true,
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture || null
      }
    });
  }

  restoreSession(req, res) {
    return restore(req, res, false);
  }

  recordActivity(req, res) {
    return restore(req, res, true);
  }

  async logout(req, res) {
    const bearer = readBearer(req, { ignoreExpiration: true });
    if (req.headers.authorization && !bearer) return sessionUnavailable(res);
    await sessions.revokeSession(req, res, bearer);
    return res.json({ success: true });
  }
}

module.exports = new AuthController();
