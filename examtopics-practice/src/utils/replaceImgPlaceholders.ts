const escapeHtmlText = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export function replaceImgPlaceholders(
  text: string,
  images: string[]
): string {
  let processedText = escapeHtmlText(text || '');

  const toLocalThenRemoteImgTag = (url: string) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'img.examtopics.com' || parsed.hostname === 'www.examtopics.com') {
        // Replace hostname with empty string, keep full path
        const localSrc = parsed.pathname;
        // Fallback to remote if local 404
        return `<img src="/img${localSrc}" onerror="this.onerror=null;this.src='${url}'" style="max-width:100%; height:auto; margin:10px 0;" />`;
      }
    } catch (_) {
      // ignore parsing errors and fall through to default
    }
    // Default: use provided URL directly
    return `<img src="${url}" style="max-width:100%; height:auto; margin:10px 0;" />`;
  };

  // Preserve intentional line breaks represented as HTML tags
  processedText = processedText
    .replace(/&lt;br\s*\/&gt;/gi, '<br/>')
    .replace(/&lt;br&gt;/gi, '<br/>');

  if (images.length > 0) {
    images.forEach((url) => {
      const imgTag = toLocalThenRemoteImgTag(url);
      processedText = processedText.replace("//IMG//", imgTag);
    });
  }

  // Replace \n with <br/> to display line breaks
  processedText = processedText.replace(/\n/g, '<br/>');

  return processedText;
}
