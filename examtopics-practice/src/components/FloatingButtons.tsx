import React from 'react';

interface FloatingButtonsProps {
  onScrollToTop: () => void;
  onScrollToCurrentQuestion: () => void;
  hasCurrentQuestion: boolean;
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  onScrollToTop,
  onScrollToCurrentQuestion,
  hasCurrentQuestion
}) => {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-50">
      {/* Scroll to Current Question Button */}
      {hasCurrentQuestion && (
        <button
          onClick={onScrollToCurrentQuestion}
          className="w-9 h-9 md:w-12 md:h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          title="Cuộn đến câu hỏi hiện tại"
        >
          <svg 
            className="w-5 h-5 md:w-6 md:h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </button>
      )}
      
      {/* Scroll to Top Button */}
      <button
        onClick={onScrollToTop}
        className="w-9 h-9 md:w-12 md:h-12 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        title="Cuộn lên đầu trang"
      >
        <svg 
          className="w-5 h-5 md:w-6 md:h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButtons;
