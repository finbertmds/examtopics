import { formatTextForClipboard, resolveClipboardUrl } from './textUtils';

describe('formatTextForClipboard', () => {
  it('preserves comparison operators in question and answer text', () => {
    const text = [
      "A. '1' + '1' + '1' < '1' * 3",
      "B. 121 + 1 != '1' + 2 * '2'",
      "C. 'AbC'.lower() < 'AB'",
      "D. '3.14' != str(3.1415)",
    ].join('\n');

    expect(formatTextForClipboard(text)).toBe(text);
  });

  it('converts supported HTML break encodings to newlines', () => {
    expect(formatTextForClipboard('first<br/>second&lt;br&gt;third\\u003cbr/\\u003e'))
      .toBe('first\nsecond\nthird\n');
  });

  it('adds the current origin to relative image paths', () => {
    expect(resolveClipboardUrl('/img/py-pcap-31-03/image27.png', 'https://practice.example'))
      .toBe('https://practice.example/img/py-pcap-31-03/image27.png');
  });

  it('preserves absolute image URLs', () => {
    expect(resolveClipboardUrl('https://cdn.example/image27.png', 'https://practice.example'))
      .toBe('https://cdn.example/image27.png');
  });

  it('preserves protocol-relative URLs that already contain a hostname', () => {
    expect(resolveClipboardUrl('//cdn.example/image27.png', 'https://practice.example'))
      .toBe('//cdn.example/image27.png');
  });

  it('preserves relative paths without a leading slash', () => {
    expect(resolveClipboardUrl('img/image27.png', 'https://practice.example'))
      .toBe('img/image27.png');
  });
});