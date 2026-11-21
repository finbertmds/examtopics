export const formatTextForClipboard = (text: string): string =>
  text
    .replace(/\\u003cbr\/\\u003e/gi, '\n')
    .replace(/&lt;br\s*\/?&gt;/gi, '\n')
    .replace(/<br\s*\/?\s*>/gi, '\n');

export const resolveClipboardUrl = (url: string, baseUrl: string): string => {
  if (!url.startsWith('/') || url.startsWith('//')) {
    return url;
  }

  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
};

// SEC-024: explanation links are rendered as hrefs, so only absolute http(s) URLs are allowed.
export const isHttpUrl = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};
