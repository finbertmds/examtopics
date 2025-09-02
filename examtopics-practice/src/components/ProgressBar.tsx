import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserProgress } from '../types';

interface ProgressBarProps {
  progress: UserProgress;
  totalQuestions: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, totalQuestions }) => {
  const { t } = useLanguage();
  const answeredCount = Object.keys(progress.answers).length;
  const percentage = Math.round((answeredCount / totalQuestions) * 100);

  const correctCount = Object.values(progress.answers).filter(answer => answer.isCorrect).length;
  const incorrectCount = answeredCount - correctCount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>{answeredCount}/{totalQuestions} {t('questionsAnswered')}</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <span className="text-2xl text-green-600 dark:text-green-400 font-semibold">{correctCount}</span>
          <span className="pl-2 text-gray-500 dark:text-gray-400">{t('correct')}</span>
        </div>
        <div className="text-center">
          <span className="text-2xl text-red-600 dark:text-red-400 font-semibold">{incorrectCount}</span>
          <span className="pl-2 text-gray-500 dark:text-gray-400">{t('incorrect')}</span>
        </div>
        <div className="text-center">
          <span className="text-2xl text-blue-600 dark:text-blue-400 font-semibold">{progress.markedForTraining.length}</span>
          <span className="pl-2 text-gray-500 dark:text-gray-400">{t('training')}</span>
        </div>
      </div>
    </div>
  );
};
