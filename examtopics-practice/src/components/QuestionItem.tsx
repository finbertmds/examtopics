import React, { useEffect, useRef, useState } from 'react';
import { Question, UserAnswer } from '../types';
import { replaceImgPlaceholders } from '../utils/replaceImgPlaceholders';
import CollapsibleQuestionText from './CollapsibleQuestionText';

interface QuestionItemProps {
  question: Question;
  userAnswer?: UserAnswer;
  onAnswer: (questionNumber: number, selectedAnswers: string[]) => void;
  onToggleTraining: (questionNumber: number) => void;
  isMarkedForTraining: boolean;
  showAnswer: boolean;
  isCurrentQuestion: boolean;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  userAnswer,
  onAnswer,
  onToggleTraining,
  isMarkedForTraining,
  showAnswer,
  isCurrentQuestion
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    userAnswer?.selectedAnswers || []
  );
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentQuestion && questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrentQuestion]);

  const handleAnswerChange = (answerKey: string, checked: boolean) => {
    let newSelectedAnswers: string[];

    if (question.multiple_choice) {
      if (checked) {
        newSelectedAnswers = [...selectedAnswers, answerKey];
      } else {
        newSelectedAnswers = selectedAnswers.filter(a => a !== answerKey);
      }
    } else {
      newSelectedAnswers = checked ? [answerKey] : [];
    }

    setSelectedAnswers(newSelectedAnswers);
    onAnswer(question.question_number, newSelectedAnswers);
  };

  const isCorrect = userAnswer?.isCorrect;
  const isAnswered = !!userAnswer;
  const correctAnswers = question.suggested_answer.split('').sort();
  const userAnswersSorted = [...selectedAnswers].sort();

  let images: string[] = [];
  if (question.question_images && question.question_images.length > 0) {
    images = images.concat(question.question_images)
  }
  if (question.answer_images && question.answer_images.length > 0) {
    images = images.concat(question.answer_images)
  }

  const questionText = question.question_text.replaceAll('\n\n\n', '').replace(/\\u003cbr\/\\u003e/g, '<br/>');
  const finalQuestionText = questionText.replaceAll('<br/><br/>', '');


  return (
    <div
      ref={questionRef}
      className={`bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 ${isCurrentQuestion ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        } ${isAnswered ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Câu {question.question_number}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleTraining(question.question_number)}
            className={`px-2 rounded-full transition-colors ${isMarkedForTraining
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
              }`}
            title={isMarkedForTraining ? 'Bỏ khỏi luyện tập' : 'Thêm vào luyện tập'}
          >
            📚
          </button>
          {isAnswered && (
            <span className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {isCorrect ? '✓' : '✗'}
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      {question.question_text && (
        <div className="mb-6">
          <CollapsibleQuestionText text={finalQuestionText} images={images} />
        </div>
      )}

      {
        question.answers && (
          <div className="space-y-3 mb-4">
            {Object.entries(question.answers).map(([key, answer]) => {
              const isSelected = selectedAnswers.includes(key);
              const isCorrectAnswer = correctAnswers.includes(key);
              const showCorrectness = showAnswer && isAnswered;

              return (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                      ? showCorrectness
                        ? isCorrectAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                      : showCorrectness && isCorrectAnswer
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type={question.multiple_choice ? 'checkbox' : 'radio'}
                    name={`question-${question.question_number}`}
                    value={key}
                    checked={isSelected}
                    onChange={(e) => handleAnswerChange(key, e.target.checked)}
                    className="mt-1"
                  // disabled={isAnswered}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700 mr-2">{key}.</span>
                    <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: replaceImgPlaceholders(answer, images) }} />
                    {showCorrectness && isCorrectAnswer && (
                      <span className="ml-2 text-green-600 font-medium">✓ Đáp án đúng</span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )
      }

      {isAnswered && showAnswer && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="mb-2">
            <strong className="text-gray-800">Đáp án của bạn:</strong>
            <span className="ml-2 text-gray-600">
              {userAnswersSorted.length > 0 ? userAnswersSorted.join(', ') : 'Chưa chọn'}
            </span>
          </div>
          <div className="mb-2">
            <strong className="text-gray-800">Đáp án gợi ý:</strong>
            <span className="ml-2 text-green-600 font-medium">
              {correctAnswers.join(', ')}
            </span>
          </div>
          {question.answer !== question.suggested_answer && (
            <div className="mb-2">
              <strong className="text-gray-800">Đáp án phụ:</strong>
              <span className="ml-2 text-blue-600 font-medium">
                {question.answer}
              </span>
            </div>
          )}
        </div>
      )}
      {question.link && (
        <a
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
        >
          🔗 Xem giải thích
        </a>
      )}
    </div>
  );
};
