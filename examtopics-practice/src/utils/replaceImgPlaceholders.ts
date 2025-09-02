export function replaceImgPlaceholders(
  text: string,
  images: string[]
): string {
  // Nếu không có placeholder thì trả về nguyên text
  if (!text.includes("//IMG//") || images.length === 0) {
    return text;
  }

  let processedText = text;

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

  // Thay thế từng placeholder với hình ảnh tương ứng
  images.forEach((url) => {
    const imgTag = toLocalThenRemoteImgTag(url);
    processedText = processedText.replace("//IMG//", imgTag);
  });

  // Replace \n with <br/> to display line breaks
  processedText = processedText.replace(/\n/g, "<br/>");

  return processedText;
}
