import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Question, UserAnswer } from '../types';

interface TrainingListProps {
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
  markedForTraining: string[];
  onQuestionClick: (topicNumber: number, questionNumber: number) => void;
  onRemoveFromTraining: (topicNumber: number, questionNumber: number) => void;
}

export const TrainingList: React.FC<TrainingListProps> = ({
  questions,
  userAnswers,
  markedForTraining,
  onQuestionClick,
  onRemoveFromTraining
}) => {
  const { t } = useLanguage();
  const trainingQuestions = questions.filter(q => markedForTraining.includes(`${q.topic_number}-${q.question_number}`));

  if (trainingQuestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('trainingList')}</h3>
        <p className="text-gray-600">{t('noQuestionsMarkedForTraining')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 training-list">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t('trainingList')} ({trainingQuestions.length})
      </h3>
      
      <div className="space-y-2 max-h-64 overflow-y-auto scrollable-content">
        {trainingQuestions.map((question) => {
          const key = `${question.topic_number}-${question.question_number}`;
          const userAnswer = userAnswers[key];
          const isCorrect = userAnswer?.isCorrect;
          const isAnswered = !!userAnswer;

          return (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <button
                onClick={() => onQuestionClick(question.topic_number, question.question_number)}
                className="flex-1 text-left flex items-center gap-3"
              >
                <span className="font-medium text-gray-800">
                  {t('question')} {question.question_number} <span className="text-sm font-normal text-gray-500">({t('topic')} {question.topic_number})</span>
                </span>
                {isAnswered && (
                  <span className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
                {!isAnswered && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {t('unanswered')}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => onRemoveFromTraining(question.topic_number, question.question_number)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title={t('removeFromTraining')}
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
