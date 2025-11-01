import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { replaceImgPlaceholders } from '../utils/replaceImgPlaceholders';

// Component for collapsible question text
const CollapsibleQuestionText: React.FC<{ text: string, images: string[] }> = ({ text, images }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Check if text is longer than 8 lines (approximately 200px height)
      const maxHeight = 210; // 8 lines * 25px line height + 10px padding
      setIsLongText(textRef.current.scrollHeight > maxHeight);
    }
  }, [text]);

  if (!isLongText) {
    return (
      <div className="question-text-container p-4">
        <div
          ref={textRef}
          className="question-text text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
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
        className={`question-text text-gray-800 dark:text-gray-200 whitespace-pre-wrap collapsible-content cursor-pointer ${isExpanded ? 'expanded' : 'collapsed'
          }`}
        role="button"
        tabIndex={0}
      >
        <div dangerouslySetInnerHTML={{ __html: replaceImgPlaceholders(text, images) }} />
      </div>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 flex items-center justify-between w-full hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded cursor-pointer transition-colors"
      >
        <span className="flex-1"></span>
        <button
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1 px-2 py-1"
          aria-label={isExpanded ? t('collapse') : t('expand')}
        >
          {isExpanded ? (
            <>
              <span>{t('collapse')}</span>
              <span className="text-xs">▲</span>
            </>
          ) : (
            <>
              <span>{t('expand')}</span>
              <span className="text-xs">▼</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CollapsibleQuestionText;
