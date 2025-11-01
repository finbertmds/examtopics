import React from 'react';
import { Language } from '../locales';
import { Exam } from '../types';
import { getExamDescription, getExamName } from '../utils/examUtils';

interface ExamCardProps {
  exam: Exam;
  language: Language;
  isMobile: boolean;
  getProgressStats: (examId: string) => any;
  onExamClick: (exam: Exam, mode?: 'exam' | 'practice') => void;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryColor: (category: string) => string;
  t: (key: string) => string;
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  language,
  isMobile,
  getProgressStats,
  onExamClick,
  getDifficultyColor,
  getCategoryColor,
  t
}) => {
  const progressStats = getProgressStats(exam.id);
  const hasProgress = progressStats && progressStats.totalAnswers > 0;
  const hasTraining = progressStats && progressStats.markedForTraining > 0;

  return (
    <div
      key={exam.id}
      onClick={() => onExamClick(exam)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3
          className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2 transition-colors cursor-help"
          title={getExamName(exam, language)}
        >
          {getExamName(exam, language)}
        </h3>
        <div className="flex flex-row items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
            {exam.difficulty}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exam.category)}`}>
            {exam.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors">
        {getExamDescription(exam, language)}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{exam.questionCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{t('questions')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{exam.estimatedTime}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{t('minutes')}</div>
        </div>
      </div>

      {/* Progress */}
      {progressStats && progressStats.totalAnswers > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('progress')}</span>
            <span className="text-sm text-blue-600 dark:text-blue-300">
              {Math.round((progressStats.totalAnswers / exam.questionCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((progressStats.totalAnswers / exam.questionCount) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-blue-600 dark:text-blue-300 mt-1">
            <span>{progressStats.totalAnswers}/{exam.questionCount} {t('questionsAnswered')}</span>
            <span>{progressStats.accuracy}% {t('accuracy')}</span>
          </div>
          {progressStats.markedForTraining > 0 && (
            <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
              📚 {progressStats.markedForTraining} {t('markedForTraining')}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="mb-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
          {exam.tags.slice(0, isMobile ? 4 : 5).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 border border-gray-200 dark:border-gray-600"
            >
              {tag}
            </span>
          ))}
          {exam.tags.length > (isMobile ? 4 : 5) && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 border border-gray-200 dark:border-gray-600">
              +{exam.tags.length - (isMobile ? 4 : 5)}
            </span>
          )}
        </div>
      </div>

      {/* Exam Buttons */}
      {!hasProgress ? (
        // Case 1: No progress - show only Start Exam button
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExamClick(exam);
          }}
          className="w-full py-2 px-4 rounded-lg transition-colors font-medium bg-blue-600 hover:bg-blue-700 text-white"
        >
          {t('startExam')}
        </button>
      ) : hasProgress && hasTraining ? (
        // Case 2: Has progress and has training - show both buttons on same line
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExamClick(exam);
            }}
            className="flex-1 py-2 px-4 rounded-lg transition-colors font-medium bg-green-600 hover:bg-green-700 text-white"
          >
            {t('continueExam')}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExamClick(exam, 'practice');
            }}
            className="flex-1 py-2 px-4 rounded-lg transition-colors font-medium bg-orange-600 hover:bg-orange-700 text-white"
          >
            {t('practiceExam')}
          </button>
        </div>
      ) : (
        // Case 3: Has progress but no training - show only Continue Exam button
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExamClick(exam);
          }}
          className="w-full py-2 px-4 rounded-lg transition-colors font-medium bg-green-600 hover:bg-green-700 text-white"
        >
          {t('continueExam')}
        </button>
      )}
    </div>
  );
};

export default ExamCard;
