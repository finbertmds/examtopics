import React from 'react';
import { FilterState, FilterType } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onRandomize: () => void;
  onReset: () => void;
  totalQuestions: number;
  answeredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onRandomize,
  onReset,
  totalQuestions,
  answeredCount
}) => {
  const filterOptions: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: 'Tất cả', count: totalQuestions },
    { value: 'answered', label: 'Đã làm', count: answeredCount },
    { value: 'unanswered', label: 'Chưa làm', count: totalQuestions - answeredCount },
    { value: 'correct', label: 'Đúng' },
    { value: 'incorrect', label: 'Sai' },
    { value: 'training', label: 'Luyện tập' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ ...filterState, type: option.value })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                filterState.type === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
              onClick={onRandomize}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              🔀 Random
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              🔄 Làm lại
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filterState.showCorrect}
            onChange={(e) => onFilterChange({ ...filterState, showCorrect: e.target.checked })}
            className="rounded"
          />
          Hiển thị đáp án đúng
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filterState.showIncorrect}
            onChange={(e) => onFilterChange({ ...filterState, showIncorrect: e.target.checked })}
            className="rounded"
          />
          Hiển thị đáp án sai
        </label>
      </div>
    </div>
  );
};
