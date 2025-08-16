import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FilterState, FilterType, UserAnswer } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onRandomize: () => void;
  onReset: () => void;
  totalQuestions: number;
  answeredCount: number;
  userAnswers: Record<number, UserAnswer>;
  markedForTraining: number[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onRandomize,
  onReset,
  totalQuestions,
  answeredCount,
  userAnswers,
  markedForTraining
}) => {
  const { t } = useLanguage();
  
  // Calculate counts for different question types
  const correctCount = Object.values(userAnswers).filter(answer => answer.isCorrect).length;
  const incorrectCount = Object.values(userAnswers).filter(answer => !answer.isCorrect).length;
  const trainingCount = markedForTraining.length;

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
