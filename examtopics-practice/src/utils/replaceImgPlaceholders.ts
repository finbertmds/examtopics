export function replaceImgPlaceholders(
  text: string,
  images: string[]
): string {
  // Nếu không có placeholder thì trả về nguyên text
  if (!text.includes("//IMG//") || images.length === 0) {
    return text;
  }

  let processedText = text;

  // Thay thế từng placeholder với hình ảnh tương ứng
  images.forEach((url, index) => {
    const imgTag = `<img src="${url}" style="max-width:100%; height:auto; margin:10px 0;" />`;
    processedText = processedText.replace("//IMG//", imgTag);
  });

  // Replace \n with <br/> to display line breaks
  processedText = processedText.replace(/\n/g, "<br/>");

  return processedText;
}
