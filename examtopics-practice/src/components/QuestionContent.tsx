import type { CSSProperties } from 'react';

const imageStyle: CSSProperties = { maxWidth: '100%', height: 'auto', margin: '10px 0' };

function parseImageUrl(source: string) {
  if (typeof source !== 'string' || !source.trim()) return;

  try {
    const url = new URL(source, window.location.href);
    if (url.protocol === 'https:' || url.protocol === 'http:') return url;
  } catch {
    return;
  }
}

export default function QuestionContent({ text, images }: { text: string; images: string[] }) {
  let imageIndex = 0;

  return (text || '').split(/(\/\/IMG\/\/|\n|<br\s*\/>|<br>)/gi).map((part, index) => {
    if (part === '\n' || /^<br(?:\s*\/)?>$/i.test(part)) return <br key={index} />;
    if (part !== '//IMG//') return part;

    const source = images[imageIndex++];
    const url = parseImageUrl(source);
    if (!url) return part;

    const useLocalCopy = url.hostname === 'img.examtopics.com' || url.hostname === 'www.examtopics.com';
    const localSource = `/img${url.pathname}`;
    return (
      <img
        key={`${index}:${source}`}
        src={useLocalCopy ? localSource : source}
        style={imageStyle}
        onError={useLocalCopy ? ({ currentTarget }) => {
          if (currentTarget.getAttribute('src') === localSource) currentTarget.src = source;
        } : undefined}
      />
    );
  });
}
