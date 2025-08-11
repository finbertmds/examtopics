export function replaceImgPlaceholders(
  text: string,
  images: string[]
): string {
  // Nếu không có placeholder thì trả về nguyên text
  if (!text.includes("//IMG//") || images.length === 0) {
    return text;
  }

  let processedText = text;

  images.forEach((url) => {
    const imgTag = `<img src="${url}" style="max-width:100%; height:auto; margin:10px 0;" />`;
    processedText = processedText.replace("//IMG//", imgTag); // thay đúng thứ tự
  });

  // Thay \n thành <br/> để hiển thị xuống dòng
  processedText = processedText.replace(/\n/g, "<br/>");

  return processedText;
}
