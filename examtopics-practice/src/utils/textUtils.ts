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