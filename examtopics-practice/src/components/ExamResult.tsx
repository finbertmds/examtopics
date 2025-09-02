import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserAnswer } from '../types';

interface ExamResultProps {
  userAnswers: Record<number, UserAnswer>;
  totalQuestions: number;
}

const ExamResult: React.FC<ExamResultProps> = ({ userAnswers, totalQuestions }) => {
  const { t } = useLanguage();
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(answer => answer.isCorrect).length;

  // Calculate accuracy percentage
  const accuracyPercentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Determine color based on accuracy
  const getAccuracyColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAccuracyBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 dark:bg-green-900';
    if (percentage >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  const getAccuracyBorderColor = (percentage: number) => {
    if (percentage >= 80) return 'border-green-200 dark:border-green-700';
    if (percentage >= 60) return 'border-yellow-200 dark:border-yellow-700';
    return 'border-red-200 dark:border-red-700';
  };

  if (answeredCount === 0) {
    return null; // Don't show if no questions answered
  }

  return (
    <div className={`pt-1 pb-1 pl-2 pr-2 rounded-lg border ${getAccuracyBgColor(accuracyPercentage)} ${getAccuracyBorderColor(accuracyPercentage)} transition-colors`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('result')}:</span>
            <span className={`text-lg font-bold ${getAccuracyColor(accuracyPercentage)}`}>
              {accuracyPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
