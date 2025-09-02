import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { Exam, FilterState, Question } from '../types';
import { getExamDescription, getExamName } from '../utils/examUtils';
import ExamResult from './ExamResult';
import { FilterBar } from './FilterBar';
import FloatingButtons from './FloatingButtons';
import { LanguageToggle } from './LanguageToggle';
import { ProgressBar } from './ProgressBar';
import { QuestionList, QuestionListRef } from './QuestionList';
import { ThemeToggle } from './ThemeToggle';

const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const exam = location.state?.exam as Exam;
  const { t, language } = useLanguage();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<FilterState>({
    type: 'all',
    showCorrect: true,
    showIncorrect: true
  });
  const hasLoadedRef = useRef(false);
  const questionListRef = useRef<QuestionListRef>(null);

  // Check for practice mode in URL and set filter state accordingly
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');

    console.log('URL mode parameter:', mode);

    if (mode === 'practice') {
      console.log('Practice mode detected, setting filter to training');
      setFilterState(prevState => ({
        ...prevState,
        type: 'training'
      }));
    }
  }, [location.search]);

  const {
    progress,
    isLoading: progressLoading,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    resetProgress
  } = useProgress(examId);

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
    if (!loading && questions.length > 0) {
      //   const nextUnanswered = questions.find(q => !progress.answers[q.question_number]);
      //   if (nextUnanswered && nextUnanswered.question_number !== progress.currentQuestion) {
      //     updateProgress({ currentQuestion: nextUnanswered.question_number });
      //   }
    }
  }, [loading, questions, progress.answers, progress.currentQuestion, updateProgress]);

  const handleAnswer = (questionNumber: number, selectedAnswers: string[]) => {
    const question = questions.find(q => q.question_number === questionNumber);
    if (!question) return;

    const correctAnswers = question.suggested_answer.split('').sort();
    const userAnswersSorted = [...selectedAnswers].sort();
    const isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswersSorted);

    saveAnswer(questionNumber, selectedAnswers, isCorrect);
    const nextQuestion = questions.find(q => q.question_number === questionNumber + 1);
    if (isCorrect && nextQuestion) {
      updateProgress({ currentQuestion: nextQuestion.question_number });
    } else {
      updateProgress({ currentQuestion: questionNumber });
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
    if (window.confirm(t('confirmResetExam'))) {
      resetProgress();
      setFilterState({
        type: 'all',
        showCorrect: true,
        showIncorrect: true
      });
      // Reset current question to 1
      updateProgress({ currentQuestion: 1 });
    }
  };

  const handleBackToHome = () => {
    // if (window.confirm(t('confirmBackToHome'))) {
    navigate('/');
    // }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToCurrentQuestion = () => {
    questionListRef.current?.scrollToCurrentQuestion();
  };

  if (loading || progressLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {loading ? t('loadingQuestions') : t('loadingProgress')}
          </p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(progress.answers).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Top header - Sticky */}
      <div className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {t('backToHome')}
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">
                {exam ? getExamName(exam, language) : ''}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          {/* Exam info with ProgressBar */}
          <div className="flex items-center gap-6 mb-4">
            {/* Left side - Exam info */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-sm transition-colors">
                      {exam ? getExamDescription(exam, language) : ''}
                    </p>
                    <div className="text-sm mt-1 text-gray-600 dark:text-gray-300 transition-colors">
                      {exam?.questionCount} {t('questions')} • {exam?.estimatedTime} {t('minutes')}
                    </div>
                    <div className="flex gap-2">
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
                    <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{t('answered')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - ProgressBar */}
            <div className="flex-1">
              <ProgressBar
                progress={progress}
                totalQuestions={questions.length}
              />
            </div>
          </div>
        </div>

        {/* ExamResult */}
        <div className="mb-4 flex justify-end">
          <ExamResult userAnswers={progress.answers} totalQuestions={questions.length} />
        </div>

        {/* FilterBar */}
        <div className="mb-4">
          <FilterBar
            filterState={filterState}
            onFilterChange={setFilterState}
            onRandomize={handleRandomize}
            onReset={handleReset}
            totalQuestions={questions.length}
            answeredCount={answeredCount}
            userAnswers={progress.answers}
            markedForTraining={progress.markedForTraining}
          />
        </div>

        {/* QuestionList */}
        <div className="bg-white dark:bg-gray-800">
          <QuestionList
            ref={questionListRef}
            questions={questions}
            userAnswers={progress.answers}
            filterState={filterState}
            currentQuestion={progress.currentQuestion}
            onAnswer={handleAnswer}
            onToggleTraining={toggleTrainingMark}
            markedForTraining={progress.markedForTraining}
            examId={examId || ''}
          />
        </div>

        {/* Floating Buttons */}
        <FloatingButtons
          onScrollToTop={handleScrollToTop}
          onScrollToCurrentQuestion={handleScrollToCurrentQuestion}
          hasCurrentQuestion={progress.currentQuestion > 0}
        />
      </div>
    </div>
  );
};

export default ExamPage;
