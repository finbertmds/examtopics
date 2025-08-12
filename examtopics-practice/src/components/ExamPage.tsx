import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Exam, FilterState, Question } from '../types';
import { FilterBar } from './FilterBar';
import { ProgressBar } from './ProgressBar';
import { QuestionList } from './QuestionList';
import { ThemeToggle } from './ThemeToggle';
import { TrainingList } from './TrainingList';

const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const exam = location.state?.exam as Exam;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<FilterState>({
    type: 'all',
    showCorrect: true,
    showIncorrect: true
  });
  const hasLoadedRef = useRef(false);

  const {
    progress,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    resetProgress
  } = useLocalStorage(examId);

  // Load questions from JSON file
  useEffect(() => {
    const abortController = new AbortController();
    
    const loadQuestions = async () => {
      if (!exam) {
        navigate('/');
        return;
      }

      // Prevent multiple calls
      if (hasLoadedRef.current) {
        console.log('loadQuestions already called, skipping...');
        return;
      }

      console.log('Loading questions for exam:', exam.file);
      hasLoadedRef.current = true;

      try {
        const response = await fetch(`/${exam.file}`, {
          signal: abortController.signal
        });
        const data = await response.json();
        console.log('Questions loaded successfully:', data.length);
        setQuestions(data);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();

    // Cleanup function to abort request if component unmounts or dependencies change
    return () => {
      abortController.abort();
      hasLoadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, exam?.file]);

  // Auto-scroll to next unanswered question
  useEffect(() => {
    // if (!loading && questions.length > 0) {
    //   const nextUnanswered = questions.find(q => !progress.answers[q.question_number]);
    //   if (nextUnanswered && nextUnanswered.question_number !== progress.currentQuestion) {
    //     updateProgress({ currentQuestion: nextUnanswered.question_number });
    //   }
    // }
  }, [loading, questions, progress.answers, progress.currentQuestion, updateProgress]);

  const handleAnswer = (questionNumber: number, selectedAnswers: string[]) => {
    const question = questions.find(q => q.question_number === questionNumber);
    if (!question) return;

    const correctAnswers = question.suggested_answer.split('').sort();
    const userAnswersSorted = [...selectedAnswers].sort();
    const isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswersSorted);

    saveAnswer(questionNumber, selectedAnswers, isCorrect);
    const nextUnanswered = questions.find(q => !progress.answers[questionNumber]);
    if (nextUnanswered && nextUnanswered.question_number !== progress.currentQuestion) {
      updateProgress({ currentQuestion: nextUnanswered.question_number });
    }
  };

  const handleRandomize = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    updateProgress({
      isRandomized: true,
      currentQuestion: 1
    });
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm lại toàn bộ bài thi? Tiến độ hiện tại sẽ bị mất.')) {
      resetProgress();
      setFilterState({
        type: 'all',
        showCorrect: true,
        showIncorrect: true
      });
    }
  };

  const handleQuestionClick = (questionNumber: number) => {
    updateProgress({ currentQuestion: questionNumber });
  };

  const handleBackToHome = () => {
    // if (window.confirm('Bạn có chắc chắn muốn quay về trang chủ? Tiến độ hiện tại sẽ được lưu.')) {
    navigate('/');
    // }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(progress.answers).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              ← Quay về trang chủ
            </button>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
              {exam?.name}
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
              {exam?.questionCount} câu hỏi • {exam?.estimatedTime} phút
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors">{exam?.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam?.difficulty === 'Advanced' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                      exam?.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    } transition-colors`}>
                    {exam?.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 transition-colors">
                    {exam?.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors">{answeredCount}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Đã làm</div>
              </div>
            </div>
          </div>
        </header>

        {/* Fixed Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 exam-layout relative">
          {/* Fixed Sidebar - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:flex lg:col-span-1">
            <div className="w-full sidebar-container bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-colors">
              <div className="space-y-6">
                <ProgressBar
                  progress={progress}
                  totalQuestions={questions.length + 1}
                />

                <TrainingList
                  questions={questions}
                  userAnswers={progress.answers}
                  markedForTraining={progress.markedForTraining}
                  onQuestionClick={handleQuestionClick}
                  onRemoveFromTraining={toggleTrainingMark}
                />
              </div>
            </div>
          </div>

          {/* Main content with scrollable area */}
          <div className="col-span-1 lg:col-span-3 flex flex-col h-full">
            {/* Fixed FilterBar */}
            <div className="sticky-filter">
              <FilterBar
                filterState={filterState}
                onFilterChange={setFilterState}
                onRandomize={handleRandomize}
                onReset={handleReset}
                totalQuestions={questions.length + 1}
                answeredCount={answeredCount}
              />
            </div>

            {/* Scrollable QuestionList */}
            <div className="flex-1 overflow-y-auto scrollable-content smooth-scroll">
              <QuestionList
                questions={questions}
                userAnswers={progress.answers}
                filterState={filterState}
                currentQuestion={progress.currentQuestion}
                onAnswer={handleAnswer}
                onToggleTraining={toggleTrainingMark}
                markedForTraining={progress.markedForTraining}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - Collapsible */}
        <div className="lg:hidden mt-6">
          <details className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
            <summary className="p-4 cursor-pointer font-medium text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 transition-colors">
              📊 Tiến độ & Luyện tập
            </summary>
            <div className="p-4 space-y-4">
              <ProgressBar
                progress={progress}
                totalQuestions={questions.length + 1}
              />
              <TrainingList
                questions={questions}
                userAnswers={progress.answers}
                markedForTraining={progress.markedForTraining}
                onQuestionClick={handleQuestionClick}
                onRemoveFromTraining={toggleTrainingMark}
              />
            </div>
          </details>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
          <p>© 2025 Exam Practice Platform</p>
          <p className="mt-1">
            {exam?.name} |
            Tổng số câu hỏi: {questions.length + 1} |
            Đã làm: {answeredCount} |
            Tỷ lệ hoàn thành: {Math.round((answeredCount / questions.length) * 100)}%
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ExamPage;
