import React from 'react';
import { UserProgress } from '../types';

interface ProgressBarProps {
  progress: UserProgress;
  totalQuestions: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, totalQuestions }) => {
  const answeredCount = Object.keys(progress.answers).length;
  const percentage = Math.round((answeredCount / totalQuestions) * 100);
  
  const correctCount = Object.values(progress.answers).filter(answer => answer.isCorrect).length;
  const incorrectCount = answeredCount - correctCount;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Tiến độ làm bài</h3>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{answeredCount}/{totalQuestions} câu đã làm</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-green-600 font-semibold">{correctCount}</div>
          <div className="text-gray-500">Đúng</div>
        </div>
        <div className="text-center">
          <div className="text-red-600 font-semibold">{incorrectCount}</div>
          <div className="text-gray-500">Sai</div>
        </div>
        <div className="text-center">
          <div className="text-blue-600 font-semibold">{progress.markedForTraining.length}</div>
          <div className="text-gray-500">Luyện tập</div>
        </div>
      </div>
    </div>
  );
};
