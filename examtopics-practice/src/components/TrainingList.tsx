import React from 'react';
import { Question, UserAnswer } from '../types';

interface TrainingListProps {
  questions: Question[];
  userAnswers: Record<number, UserAnswer>;
  markedForTraining: number[];
  onQuestionClick: (questionNumber: number) => void;
  onRemoveFromTraining: (questionNumber: number) => void;
}

export const TrainingList: React.FC<TrainingListProps> = ({
  questions,
  userAnswers,
  markedForTraining,
  onQuestionClick,
  onRemoveFromTraining
}) => {
  const trainingQuestions = questions.filter(q => markedForTraining.includes(q.question_number));

  if (trainingQuestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Danh sách luyện tập</h3>
        <p className="text-gray-600">Chưa có câu hỏi nào được đánh dấu để luyện tập.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        📚 Danh sách luyện tập ({trainingQuestions.length})
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto scrollable-content">
        {trainingQuestions.map((question) => {
          const userAnswer = userAnswers[question.question_number];
          const isCorrect = userAnswer?.isCorrect;
          const isAnswered = !!userAnswer;

          return (
            <div
              key={question.question_number}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => onQuestionClick(question.question_number)}
                className="flex-1 text-left flex items-center gap-3"
              >
                <span className="font-medium text-gray-800">
                  Câu {question.question_number}
                </span>
                {isAnswered && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? '✓ Đúng' : '✗ Sai'}
                  </span>
                )}
                {!isAnswered && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Chưa làm
                  </span>
                )}
              </button>
              
              <button
                onClick={() => onRemoveFromTraining(question.question_number)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Bỏ khỏi luyện tập"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
