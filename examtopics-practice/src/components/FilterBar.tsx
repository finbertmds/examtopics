import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FilterState, FilterType, Question, UserAnswer } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onRandomize: () => void;
  onReset: () => void;
  totalQuestions: number;
  answeredCount: number;
  userAnswers: Record<string, UserAnswer>;
  markedForTraining: string[];
  questions: Question[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onRandomize,
  onReset,
  totalQuestions,
  answeredCount,
  userAnswers,
  markedForTraining,
  questions
}) => {
  const { t } = useLanguage();
  
  // Calculate counts for different question types
  const correctCount = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
  const incorrectCount = Object.values(userAnswers).filter(answer => !answer.isCorrect).length;
  const trainingCount = markedForTraining.length;

  // Calculate topic distribution from all questions (not just answered ones)
  const topicDistribution = questions.reduce((acc, question) => {
    acc[question.topic_number] = (acc[question.topic_number] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Calculate answered questions per topic
  const answeredTopicDistribution = Object.values(userAnswers).reduce((acc, answer) => {
    acc[answer.topicNumber] = (acc[answer.topicNumber] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const filterOptions: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: t('all'), count: totalQuestions },
    { value: 'correct', label: t('correct'), count: correctCount },
    { value: 'incorrect', label: t('incorrect'), count: incorrectCount },
    { value: 'answered', label: t('questionsAnswered'), count: answeredCount },
    { value: 'unanswered', label: t('unanswered'), count: totalQuestions - answeredCount },
    { value: 'training', label: t('training'), count: trainingCount }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ ...filterState, type: option.value })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                filterState.type === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
              {option.count !== undefined && (
                <span className="ml-1 text-xs opacity-75">({option.count})</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end w-full">
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange({ ...filterState, type: 'training' })}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              📚 {t('training')}
            </button>
            <button
              onClick={onRandomize}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              🔀 {t('randomize')}
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              🔄 {t('reset')}
            </button>
          </div>
        </div>
      </div>

      {/* Topic distribution info */}
      {Object.keys(topicDistribution).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t('topicDistribution')}:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(topicDistribution).map(([topic, totalCount]) => {
              const answeredCount = answeredTopicDistribution[parseInt(topic)] || 0;
              return (
                <span
                  key={topic}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                >
                  {t('topic')} {topic}: {answeredCount}/{totalCount}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-1">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={filterState.showCorrect}
            onChange={(e) => onFilterChange({ ...filterState, showCorrect: e.target.checked })}
            className="rounded"
          />
          {t('showCorrectAnswers')}
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={filterState.showIncorrect}
            onChange={(e) => onFilterChange({ ...filterState, showIncorrect: e.target.checked })}
            className="rounded"
          />
          {t('showIncorrectAnswers')}
        </label>
      </div>
    </div>
  );
};
