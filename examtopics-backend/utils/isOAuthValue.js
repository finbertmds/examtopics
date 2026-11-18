function isOAuthValue(value) {
  return typeof value === 'string' && value.length === 43 && /^[A-Za-z0-9_-]+$/.test(value);
}

module.exports = isOAuthValue;
