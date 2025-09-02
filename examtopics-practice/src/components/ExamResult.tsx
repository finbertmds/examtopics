import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Question, UserAnswer } from '../types';

interface ExamResultProps {
  userAnswers: Record<string, UserAnswer>;
  totalQuestions: number;
  questions: Question[];
}

const ExamResult: React.FC<ExamResultProps> = ({ userAnswers, totalQuestions, questions }) => {
  const { t } = useLanguage();
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(answer => answer.isCorrect).length;

  // Calculate accuracy percentage
  const accuracyPercentage = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Calculate topic distribution from all questions
  const topicDistribution = questions.reduce((acc, question) => {
    acc[question.topic_number] = (acc[question.topic_number] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Calculate answered questions per topic
  const answeredTopicDistribution = Object.values(userAnswers).reduce((acc, answer) => {
    acc[answer.topicNumber] = (acc[answer.topicNumber] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

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
          {Object.keys(topicDistribution).length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>|</span>
              {Object.entries(topicDistribution).map(([topic, totalCount], index) => {
                const answeredCount = answeredTopicDistribution[parseInt(topic)] || 0;
                return (
                  <span key={topic}>
                    {index > 0 && <span className="mx-1">•</span>}
                    {t('topic')} {topic}: {answeredCount}/{totalCount}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
