import { useEffect, useRef, useState } from 'react';
import { replaceImgPlaceholders } from '../utils/replaceImgPlaceholders';

// Component for collapsible question text
const CollapsibleQuestionText: React.FC<{ text: string, images: string[] }> = ({ text, images }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Check if text is longer than 8 lines (approximately 200px height)
      const maxHeight = 200; // 8 lines * 25px line height
      setIsLongText(textRef.current.scrollHeight > maxHeight);
    }
  }, [text]);

  if (!isLongText) {
    return (
      <div className="question-text-container p-4">
        <div 
          ref={textRef}
          className="question-text text-gray-800 whitespace-pre-wrap"
          >
            <div dangerouslySetInnerHTML={{ __html: replaceImgPlaceholders(text, images) }} />
        </div>
      </div>
    );
  }

  return (
    <div className="question-text-container p-4">
      <div 
        ref={textRef}
        className={`question-text text-gray-800 whitespace-pre-wrap collapsible-content ${
          isExpanded ? 'expanded' : 'collapsed'
        }`}
      >
          <div dangerouslySetInnerHTML={{ __html: replaceImgPlaceholders(text, images) }} />
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors hover:bg-blue-50 px-2 py-1 rounded"
      >
        {isExpanded ? (
          <>
            <span>Thu gọn</span>
            <span className="text-xs">▲</span>
          </>
        ) : (
          <>
            <span>Xem thêm</span>
            <span className="text-xs">▼</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CollapsibleQuestionText;
