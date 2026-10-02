import { replaceImgPlaceholders } from './replaceImgPlaceholders';

describe('replaceImgPlaceholders', () => {
  it('escapes raw HTML-like answer text so it displays as text', () => {
    const result = replaceImgPlaceholders("<type 'double'=''></type>", []);

    expect(result).toContain('&lt;type');
    expect(result).toContain('&lt;/type&gt;');
    expect(result).not.toContain('<type');
  });

  it('preserves img tags and line breaks while escaping text', () => {
    const result = replaceImgPlaceholders('before\n//IMG//\nafter', ['https://example.com/image.png']);

    expect(result).toContain('<br/>');
    expect(result).toContain('<img src="/img/https://example.com/image.png"');
  });
});
