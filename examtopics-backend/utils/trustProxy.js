// SEC-022: Express `trust proxy` is configured as an explicit hop count only.
// Unset (the default) keeps req.ip equal to the socket peer. `true` or a list
// would let clients choose their own IP through X-Forwarded-For, so any value
// other than a small integer is a startup error.
function parseTrustProxy(value) {
  if (value === undefined || value === '') return false;
  if (!/^[1-5]$/.test(value)) {
    throw new Error('TRUST_PROXY must be the number of trusted reverse proxy hops (1-5) or unset');
  }
  return Number(value);
}

module.exports = parseTrustProxy;
