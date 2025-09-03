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
  const [currentExam, setCurrentExam] = useState<Exam | null>(exam);
  const [urlTopicNumber, setUrlTopicNumber] = useState<number | null>(null);
  const [urlQuestionNumber, setUrlQuestionNumber] = useState<number | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    type: 'all',
    showCorrect: true,
    showIncorrect: true,
    selectedTopic: 'all'
  });
  const hasLoadedRef = useRef(false);
  const questionListRef = useRef<QuestionListRef>(null);

  const {
    progress,
    isLoading: progressLoading,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    submitExam,
    resetProgress,
    getHistory,
    getExamStats
  } = useProgress(examId);

  // Check for URL parameters and set state accordingly
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    const topicNumber = urlParams.get('topicNumber');
    const questionNumber = urlParams.get('questionNumber');

    if (mode === 'practice') {
      console.log('Practice mode detected, setting filter to training');
      setFilterState(prevState => ({
        ...prevState,
        type: 'training',
        selectedTopic: 'all'
      }));
    }

    // If topicNumber and questionNumber are provided, just scroll to that question without updating progress
    if (topicNumber && questionNumber) {
      const topicNum = parseInt(topicNumber);
      const questionNum = parseInt(questionNumber);
      
      if (!isNaN(topicNum) && !isNaN(questionNum)) {
        console.log('URL contains topic and question, will scroll to:', { topicNum, questionNum });
        setUrlTopicNumber(topicNum);
        setUrlQuestionNumber(questionNum);
      }
    } else {
      // Clear URL parameters if not present
      setUrlTopicNumber(null);
      setUrlQuestionNumber(null);
    }
  }, [location.search]);

  // Load exam and questions
  useEffect(() => {
    const abortController = new AbortController();

    const loadExamAndQuestions = async () => {
      let currentExam = exam;

      // If no exam in state but we have examId, try to load exam from exams.json
      if (!currentExam && examId) {
        try {
          console.log('Loading exam from exams.json for examId:', examId);
          const examsResponse = await fetch('/exams/exams.json', {
            signal: abortController.signal
          });
          const examsData = await examsResponse.json();
          currentExam = examsData.find((e: Exam) => e.id === examId);
          
          if (!currentExam) {
            console.error('Exam not found for examId:', examId);
            navigate('/');
            return;
          }
          
          console.log('Exam loaded from exams.json:', currentExam);
          setCurrentExam(currentExam);
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('Request was aborted');
            return;
          }
          console.error('Error loading exam from exams.json:', error);
          navigate('/');
          return;
        }
      }

      if (!currentExam) {
        navigate('/');
        return;
      }

      // Update currentExam state if it's different from the loaded exam
      if (currentExam !== exam) {
        setCurrentExam(currentExam);
      }

      // Prevent multiple calls
      if (hasLoadedRef.current) {
        console.log('loadExamAndQuestions already called, skipping...');
        return;
      }

      console.log('Loading questions for exam:', currentExam.file);
      hasLoadedRef.current = true;

      try {
        const response = await fetch(`/${currentExam.file}`, {
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

    loadExamAndQuestions();

    // Cleanup function to abort request if component unmounts or dependencies change
    return () => {
      abortController.abort();
      hasLoadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, exam?.file, currentExam?.file]);

  // Auto-scroll to question when questions are loaded
  useEffect(() => {
    if (!loading && questions.length > 0 && questionListRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (urlTopicNumber && urlQuestionNumber) {
          // Scroll to URL-specified question
          const targetElement = document.querySelector(`[data-topic-number="${urlTopicNumber}"][data-question-number="${urlQuestionNumber}"]`);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            console.log('Scrolled to URL-specified question:', { urlTopicNumber, urlQuestionNumber });
          }
        } else {
          // Scroll to current question from progress
          questionListRef.current?.scrollToCurrentQuestion();
        }
      }, 100);
    }
  }, [loading, questions, progress.currentTopic, progress.currentQuestion, urlTopicNumber, urlQuestionNumber]);

  const handleAnswer = async (topicNumber: number, questionNumber: number, selectedAnswers: string[]) => {
    const question = questions.find(q => q.topic_number === topicNumber && q.question_number === questionNumber);
    if (!question) return;

    const correctAnswers = question.suggested_answer.split('').sort();
    const userAnswersSorted = [...selectedAnswers].sort();
    const isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userAnswersSorted);

    await saveAnswer(topicNumber, questionNumber, selectedAnswers, isCorrect);
    const nextQuestion = questions.find(q => q.topic_number === topicNumber && q.question_number === questionNumber + 1);
    if (isCorrect && nextQuestion) {
      updateProgress({ currentTopic: topicNumber, currentQuestion: nextQuestion.question_number });
    } else {
      updateProgress({ currentTopic: topicNumber, currentQuestion: questionNumber });
    }
  };

  const handleRandomize = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    updateProgress({
      isRandomized: true,
      currentTopic: 1,
      currentQuestion: 1
    });
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(progress.answers).length;
    const correctCount = Object.values(progress.answers).filter((answer: any) => answer.isCorrect).length;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    
    const score = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      accuracy: accuracy
    };
    
    if (window.confirm(t('confirmSubmitExam'))) {
      submitExam(score, questions.length, answeredCount);
      setFilterState({
        type: 'all',
        showCorrect: true,
        showIncorrect: true,
        selectedTopic: 'all'
      });
      // Reset current question to 1
      updateProgress({ currentTopic: 1, currentQuestion: 1 });
    }
  };

  const handleFilterChange = (newFilterState: FilterState) => {
    // Check if we're changing from training to something else and URL has mode=practice
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get('mode');
    
    if (newFilterState.type !== 'training' && mode === 'practice') {
      // Remove mode parameter from URL
      urlParams.delete('mode');
      const newUrl = `${location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
      navigate(newUrl, { replace: true });
    }
    
    setFilterState(newFilterState);
  };

  const handleTopicChange = (topicNumber: number | 'all') => {
    if (topicNumber === 'all') {
      // Find the first topic that is not completed
      const topicNumbers = Array.from(new Set(questions.map(q => q.topic_number))).sort((a, b) => a - b);
      
      for (const topicNum of topicNumbers) {
        const topicQuestions = questions.filter(q => q.topic_number === topicNum);
        const answeredQuestionsInTopic = topicQuestions.filter(q => {
          const key = `${q.topic_number}-${q.question_number}`;
          return progress.answers[key];
        });

        // If this topic is not completed (answered questions < total questions)
        if (answeredQuestionsInTopic.length < topicQuestions.length) {
          let nextQuestionNumber = 1;
          if (answeredQuestionsInTopic.length > 0) {
            // Find the highest question number that has been answered in this topic
            const lastAnsweredQuestion = answeredQuestionsInTopic.reduce((prev, current) => 
              prev.question_number > current.question_number ? prev : current
            );
            nextQuestionNumber = lastAnsweredQuestion.question_number + 1;
          }

          // Update current topic and question
          updateProgress({ 
            currentTopic: topicNum, 
            currentQuestion: nextQuestionNumber 
          });
          return;
        }
      }

      // If all topics are completed, go to the first topic, first question
      updateProgress({ 
        currentTopic: topicNumbers[0] || 1, 
        currentQuestion: 1 
      });
    } else {
      // Find the last answered question in the selected topic
      const topicQuestions = questions.filter(q => q.topic_number === topicNumber);
      const answeredQuestionsInTopic = topicQuestions.filter(q => {
        const key = `${q.topic_number}-${q.question_number}`;
        return progress.answers[key];
      });

      let nextQuestionNumber = 1;
      if (answeredQuestionsInTopic.length > 0) {
        // Find the highest question number that has been answered in this topic
        const lastAnsweredQuestion = answeredQuestionsInTopic.reduce((prev, current) => 
          prev.question_number > current.question_number ? prev : current
        );
        nextQuestionNumber = lastAnsweredQuestion.question_number + 1;
      }

      // Update current topic and question
      updateProgress({ 
        currentTopic: topicNumber, 
        currentQuestion: nextQuestionNumber 
      });
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
              className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title={t('backToHome')}
            >
              ←
            </button>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors truncate">
                {currentExam ? getExamName(currentExam, language) : ''}
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
          <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-4">
            {/* Left side - Exam info */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xl text-gray-600 dark:text-gray-300 text-sm transition-colors truncate">
                      {currentExam ? getExamDescription(currentExam, language) : ''}
                    </p>
                    <div className="text-sm mt-3 text-gray-600 dark:text-gray-300 transition-colors">
                      {currentExam?.questionCount} {t('questions')} • {currentExam?.estimatedTime} {t('minutes')}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentExam?.difficulty === 'Advanced' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        currentExam?.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        } transition-colors`}>
                        {currentExam?.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 transition-colors">
                        {currentExam?.category}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-center sm:text-right flex-shrink-0">
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
          <ExamResult userAnswers={progress.answers} totalQuestions={questions.length} questions={questions} currentTopic={progress.currentTopic} />
        </div>

        {/* FilterBar */}
        <div className="mb-4">
          <FilterBar
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onRandomize={handleRandomize}
            onReset={handleSubmit}
            totalQuestions={questions.length}
            answeredCount={answeredCount}
            userAnswers={progress.answers}
            markedForTraining={progress.markedForTraining}
            questions={questions}
            onTopicChange={handleTopicChange}
          />
        </div>

        {/* QuestionList */}
        <div className="bg-white dark:bg-gray-800">
          <QuestionList
            ref={questionListRef}
            questions={questions}
            progress={progress}
            filterState={filterState}
            currentQuestion={progress.currentQuestion}
            currentTopic={progress.currentTopic}
            onAnswer={handleAnswer}
            onToggleTraining={toggleTrainingMark}
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
