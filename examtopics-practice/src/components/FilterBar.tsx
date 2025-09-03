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
  onTopicChange: (topic: number | 'all') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onRandomize,
  onReset,
  totalQuestions,
  answeredCount: totalAnsweredCount,
  userAnswers,
  markedForTraining,
  questions,
  onTopicChange
}) => {
  const { t } = useLanguage();

  // Calculate topic distribution from all questions (not just answered ones)
  const topicDistribution = questions.reduce((acc, question) => {
    acc[question.topic_number] = (acc[question.topic_number] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Calculate counts for different question types based on selected topic
  const getFilteredQuestions = () => {
    let filtered = questions;
    if (filterState.selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topic_number === filterState.selectedTopic);
    }
    return filtered;
  };

  const filteredQuestions = getFilteredQuestions();
  const filteredAnsweredQuestions = filteredQuestions.filter(q => {
    const key = `${q.topic_number}-${q.question_number}`;
    return userAnswers[key];
  });

  const correctCount = filteredAnsweredQuestions.filter(q => {
    const key = `${q.topic_number}-${q.question_number}`;
    return userAnswers[key]?.isCorrect;
  }).length;

  const incorrectCount = filteredAnsweredQuestions.filter(q => {
    const key = `${q.topic_number}-${q.question_number}`;
    return userAnswers[key] && !userAnswers[key].isCorrect;
  }).length;

  const answeredCount = filteredAnsweredQuestions.length;
  const unansweredCount = filteredQuestions.length - answeredCount;
  const trainingCount = filteredQuestions.filter(q => {
    const key = `${q.topic_number}-${q.question_number}`;
    return markedForTraining.includes(key);
  }).length;

  const filterOptions: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: t('all'), count: filteredQuestions.length },
    { value: 'correct', label: t('correct'), count: correctCount },
    { value: 'incorrect', label: t('incorrect'), count: incorrectCount },
    { value: 'answered', label: t('answered'), count: answeredCount },
    { value: 'unanswered', label: t('unanswered'), count: unansweredCount },
    { value: 'training', label: t('training'), count: trainingCount }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {Object.keys(topicDistribution).length > 0 && (
        <div className="pb-2 gap-2 border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-md text-gray-500 dark:text-gray-400">
                {t('selectTopic')}:
              </label>
              <select
                value={filterState.selectedTopic}
                onChange={(e) => {
                  const newTopic = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
                  onFilterChange({
                    ...filterState,
                    selectedTopic: newTopic
                  });
                  onTopicChange(newTopic);
                }}
                className="px-2 py-1 text-md border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">{t('allTopics')}</option>
                {Object.keys(topicDistribution).map((topic) => (
                  <option key={topic} value={topic}>
                    {t('topic')} {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1">
        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ ...filterState, type: option.value })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${filterState.type === option.value
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
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => onFilterChange({ ...filterState, type: 'training' })}
              className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs text-sm font-medium"
            >
              📚 {t('training')}
            </button>
            <button
              onClick={onRandomize}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs text-sm font-medium"
            >
              🔀 {t('randomize')}
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs text-sm font-medium"
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
