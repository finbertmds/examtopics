const { createHmac, randomBytes, timingSafeEqual } = require('node:crypto');

const STATE_TTL_MS = 10 * 60 * 1000;

function createOAuthStateStore(secret, secure) {
  // The host prefix blocks cookie injection from sibling subdomains over HTTPS.
  const cookieName = secure ? '__Host-examtopics-oauth-state' : 'examtopics-oauth-state';
  const cookieOptions = { httpOnly: true, secure, sameSite: 'lax', path: '/' };
  const sign = (state, expiresAt) => createHmac('sha256', secret)
    .update(`google-oauth-state:${state}:${expiresAt}`)
    .digest();

  return {
    store(req, done) {
      const state = randomBytes(32).toString('base64url');
      const expiresAt = Date.now() + STATE_TTL_MS;
      const signature = sign(state, expiresAt).toString('base64url');
      req.res.cookie(cookieName, `${expiresAt}.${signature}`, {
        ...cookieOptions,
        maxAge: STATE_TTL_MS,
      });
      done(null, state);
    },

    verify(req, state, done) {
      req.res.clearCookie(cookieName, cookieOptions);
      const cookie = req.headers.cookie?.split(';')
        .map((value) => value.trim())
        .find((value) => value.startsWith(`${cookieName}=`));
      const match = /^(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(cookie?.slice(cookieName.length + 1));
      if (!match || typeof state !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(state)) {
        return done(null, false);
      }

      const [, expiresAt, signature] = match;
      const valid = Number(expiresAt) > Date.now() &&
        timingSafeEqual(Buffer.from(signature, 'base64url'), sign(state, expiresAt));
      return done(null, valid);
    },
  };
}

module.exports = createOAuthStateStore;
