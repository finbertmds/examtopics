import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Question, ReportData, UserAnswer } from '../types';
import { apiClient } from '../utils/apiClient';
import { replaceImgPlaceholders } from '../utils/replaceImgPlaceholders';
import CollapsibleQuestionText from './CollapsibleQuestionText';
import ReportModal from './ReportModal';

interface QuestionItemProps {
  question: Question;
  userAnswer?: UserAnswer;
  onAnswer: (topicNumber: number, questionNumber: number, selectedAnswers: string[]) => void;
  onToggleTraining: (topicNumber: number, questionNumber: number) => void;
  isMarkedForTraining: boolean;
  showAnswer: boolean;
  isCurrentQuestion: boolean;
  examId: string;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  userAnswer,
  onAnswer,
  onToggleTraining,
  isMarkedForTraining,
  showAnswer,
  isCurrentQuestion,
  examId
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    userAnswer?.selectedAnswers || []
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentQuestion && questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrentQuestion]);

  // Reset selectedAnswers when userAnswer changes (e.g., after reset)
  useEffect(() => {
    setSelectedAnswers(userAnswer?.selectedAnswers || []);
  }, [userAnswer?.selectedAnswers]);

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
    onAnswer(question.topic_number, question.question_number, newSelectedAnswers);
  };

  const handleReportSubmit = async (reason: string, comment: string) => {
    try {
      const reportData: ReportData = {
        topicNumber: question.topic_number,
        questionNumber: question.question_number,
        examId: examId,
        reason: reason,
        comment: comment,
        user: user?.email || null,
        url: `${window.location.origin}/exam/${examId}?topicNumber=${question.topic_number}&questionNumber=${question.question_number}`
      };

      const response = await apiClient.submitReport(reportData);

      if (response.success) {
        toast.success(`${t('reportSubmittedSuccessfully')} - ${t('topic')} ${question.topic_number}, ${t('question')} ${question.question_number}`);
      } else {
        throw new Error(response.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(t('errorSubmittingReport'));
      throw error;
    }
  };

  const isCorrect = userAnswer?.isCorrect;
  const isAnswered = !!userAnswer;
  const correctAnswers = question.suggested_answer.split('').sort();

  // Check if user has selected enough answers for multiple choice questions
  const hasSelectedEnoughAnswers = question.multiple_choice
    ? selectedAnswers.length >= correctAnswers.length
    : selectedAnswers.length > 0;

  // Only show answer if user has selected enough answers or if it's a single choice question
  const shouldShowAnswer = showAnswer && isAnswered && hasSelectedEnoughAnswers;

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
      data-topic-number={question.topic_number}
      data-question-number={question.question_number}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border-l-4 ${isCurrentQuestion ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 dark:border-gray-600'
        } ${isAnswered ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {t('question')} {question.question_number} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({t('topic')} {question.topic_number})</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-2 rounded-full transition-colors bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 hover:text-red-700 dark:hover:text-red-300"
            title={t('reportQuestion')}
          >
            🚨
          </button>
          <button
            onClick={() => onToggleTraining(question.topic_number, question.question_number)}
            className={`px-2 rounded-full transition-colors ${isMarkedForTraining
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            title={isMarkedForTraining ? t('removeFromTraining') : t('addToTraining')}
          >
            {isMarkedForTraining ? '📚' : '📖'}
          </button>
          {isAnswered && (
            <span className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${isCorrect ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
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
            {Object.entries(question.answers).map(([key, answer], answerIndex) => {
              const isSelected = selectedAnswers.includes(key);
              const isCorrectAnswer = correctAnswers.includes(key);
              const showCorrectness = shouldShowAnswer;

              // Đếm số lượng placeholder //IMG// trong question_text
              const questionPlaceholderCount = (question.question_text.match(/\/\/IMG\/\//g) || []).length;

              // Tính toán vị trí bắt đầu trong mảng images cho answer này
              let startIndex = questionPlaceholderCount; // Bắt đầu sau các hình ảnh của question_text
              for (let i = 0; i < answerIndex; i++) {
                const prevAnswer = Object.values(question.answers)[i];
                const prevPlaceholderCount = (prevAnswer.match(/\/\/IMG\/\//g) || []).length;
                startIndex += prevPlaceholderCount;
              }

              // Đếm số lượng placeholder //IMG// trong answer này
              const placeholderCount = (answer.match(/\/\/IMG\/\//g) || []).length;

              // Lấy hình ảnh cho answer này
              const answerImages = images.slice(startIndex, startIndex + placeholderCount);

              return (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${isSelected
                    ? showCorrectness
                      ? isCorrectAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-900'
                        : 'border-red-500 bg-red-50 dark:bg-red-900'
                      : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900'
                    : showCorrectness && isCorrectAnswer
                      ? 'border-green-300 bg-green-50 dark:bg-green-900'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                  <input
                    type={question.multiple_choice ? 'checkbox' : 'radio'}
                    name={`question-${question.topic_number}-${question.question_number}`}
                    value={key}
                    checked={isSelected}
                    onChange={(e) => handleAnswerChange(key, e.target.checked)}
                    className="mt-1"
                  // disabled={isAnswered}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-2">{key}.</span>
                    <span className="text-gray-800 dark:text-gray-200 break-words" dangerouslySetInnerHTML={{ __html: replaceImgPlaceholders(answer, answerImages) }} />
                    {showCorrectness && isCorrectAnswer && (
                      <span className="ml-2 text-green-600 dark:text-green-400 font-medium">✓ {t('correct')}</span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )
      }

      {/* Show notification for multiple choice questions that need more answers */}
      {isAnswered && showAnswer && !shouldShowAnswer && question.multiple_choice && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
            <span className="text-sm">
              {t('selectMoreAnswers')} {correctAnswers.length - selectedAnswers.length} {t('toViewResult')}
            </span>
          </div>
        </div>
      )}

      {shouldShowAnswer && (
        <div className="mt-4 p-2 pl-4 pr-4 bg-gray-50 dark:bg-gray-700 rounded-lg w-fit">
          <div className="flex items-center gap-2">
            <strong className="text-gray-800 dark:text-gray-200">{t('suggestedAnswer')}</strong>
            <span className="ml-2 text-green-600 dark:text-green-400 font-medium break-words">
              {correctAnswers.join(', ')}
            </span>
          </div>
          {question.answer !== question.suggested_answer && (
            <div className="flex items-center gap-2">
              <strong className="text-gray-800 dark:text-gray-200">{t('additionalAnswer')}</strong>
              <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-medium break-words">
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
          className="inline-flex items-center mt-3 gap-1 text-blue-600 hover:text-blue-800 font-medium"
        >
          🔗 {t('viewExplanation')}
        </a>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        topicNumber={question.topic_number}
        questionNumber={question.question_number}
        examId={examId}
      />
    </div>
  );
};
