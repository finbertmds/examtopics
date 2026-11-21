const { createHash, randomBytes } = require('node:crypto');
const OAuthLoginCode = require('../models/OAuthLoginCode');
const User = require('../models/User');

const LOGIN_CODE_TTL_MS = 60 * 1000;
const sha256 = (value) => createHash('sha256').update(value).digest('base64url');

// Issue a single-use login code bound to the browser's PKCE-style challenge.
// Only the code's hash is stored.
async function issueLoginCode(challenge, userId) {
  const code = randomBytes(32).toString('base64url');
  await OAuthLoginCode.create({
    _id: sha256(code),
    challenge,
    userId,
    expiresAt: new Date(Date.now() + LOGIN_CODE_TTL_MS),
  });
  return code;
}

// Redeem a code once with its verifier. Returns the user, or null when the code
// is unknown, expired, already used or presented with the wrong verifier.
async function redeemLoginCode(code, verifier) {
  const grant = await OAuthLoginCode.findOneAndDelete({
    _id: sha256(code),
    challenge: sha256(verifier),
    expiresAt: { $gt: new Date(Date.now()) },
  });
  return grant ? User.findById(grant.userId) : null;
}

module.exports = { issueLoginCode, redeemLoginCode };
