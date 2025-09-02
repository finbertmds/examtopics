import { forwardRef, useImperativeHandle } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FilterState, Question, UserProgress } from '../types';
import { QuestionItem } from './QuestionItem';

interface QuestionListProps {
  questions: Question[];
  progress: UserProgress;
  filterState: FilterState;
  onAnswer: (topicNumber: number, questionNumber: number, selectedAnswers: string[]) => void;
  onToggleTraining: (topicNumber: number, questionNumber: number) => void;
  currentQuestion: number;
  currentTopic: number;
  examId: string;
}

export interface QuestionListRef {
  scrollToCurrentQuestion: () => void;
}

export const QuestionList = forwardRef<QuestionListRef, QuestionListProps>(({
  questions,
  progress,
  filterState,
  currentQuestion,
  currentTopic,
  onAnswer,
  onToggleTraining,
  examId
}, ref) => {
  const { t } = useLanguage();
  
  const getFilteredQuestions = () => {
    let filtered = questions;

    // First filter by selected topic
    if (filterState.selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topic_number === filterState.selectedTopic);
    }

    // Then apply other filters
    switch (filterState.type) {
      case 'answered':
        filtered = filtered.filter(q => {
          const key = `${q.topic_number}-${q.question_number}`;
          return progress.answers[key];
        });
        break;
      case 'unanswered':
        filtered = filtered.filter(q => {
          const key = `${q.topic_number}-${q.question_number}`;
          return !progress.answers[key];
        });
        break;
      case 'correct':
        filtered = filtered.filter(q => {
          const key = `${q.topic_number}-${q.question_number}`;
          const answer = progress.answers[key];
          return answer && answer.isCorrect;
        });
        break;
      case 'incorrect':
        filtered = filtered.filter(q => {
          const key = `${q.topic_number}-${q.question_number}`;
          const answer = progress.answers[key];
          return answer && !answer.isCorrect;
        });
        break;
      case 'training':
        filtered = filtered.filter(q => {
          const key = `${q.topic_number}-${q.question_number}`;
          return progress.markedForTraining.includes(key);
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredQuestions = getFilteredQuestions();

  // Expose scrollToCurrentQuestion method to parent
  useImperativeHandle(ref, () => ({
    scrollToCurrentQuestion: () => {
      const currentQuestionElement = document.querySelector(`[data-topic-number="${currentTopic}"][data-question-number="${currentQuestion}"]`);
      if (currentQuestionElement) {
        currentQuestionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }), [currentQuestion, currentTopic]);

  if (filteredQuestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">{t('noQuestionsMatchFilter')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-100 dark:bg-gray-900">
      {filteredQuestions.map((question) => {
        const key = `${question.topic_number}-${question.question_number}`;
        const userAnswer = progress.answers[key];
        const isMarkedForTraining = progress.markedForTraining.includes(key);
        const isCurrentQuestion = question.topic_number === currentTopic && question.question_number === currentQuestion;

        return (
          <QuestionItem
            key={`${question.topic_number}-${question.question_number}`}
            question={question}
            userAnswer={userAnswer}
            onAnswer={onAnswer}
            onToggleTraining={onToggleTraining}
            isMarkedForTraining={isMarkedForTraining}
            showAnswer={filterState.showCorrect || filterState.showIncorrect}
            isCurrentQuestion={isCurrentQuestion}
            examId={examId}
          />
        );
      })}
    </div>
  );
});
