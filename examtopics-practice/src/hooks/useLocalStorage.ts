import { useEffect, useRef, useState } from 'react';
import { UserProgress } from '../types';

const STORAGE_KEY = 'exam-progress';

export const useLocalStorage = (examId?: string) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const allProgress = JSON.parse(stored);
      const examProgress = examId ? allProgress[examId] : null;
      
      if (examProgress) {
        // Convert date strings back to Date objects
        if (examProgress.startTime) examProgress.startTime = new Date(examProgress.startTime);
        if (examProgress.lastSessionTime) examProgress.lastSessionTime = new Date(examProgress.lastSessionTime);
        if (examProgress.sessionStartTime) examProgress.sessionStartTime = new Date(examProgress.sessionStartTime);
        Object.values(examProgress.answers).forEach((answer: any) => {
          if (answer.answeredAt) answer.answeredAt = new Date(answer.answeredAt);
        });
        return examProgress;
      }
    }
    
    return {
      examId: examId || '',
      answers: {},
      markedForTraining: [],
      currentQuestion: 1,
      isRandomized: false,
      startTime: new Date(),
      lastSessionTime: new Date(),
      totalTimeSpent: 0,
      sessionStartTime: new Date()
    };
  });

  const isPageActive = useRef(true);
  const sessionStartTime = useRef<Date | null>(null);

  // Tính thời gian đã làm khi page active/inactive
  const updateTimeSpent = () => {
    if (!sessionStartTime.current || !isPageActive.current) return;
    
    const now = new Date();
    const sessionTime = now.getTime() - sessionStartTime.current.getTime();
    
    setProgress(prev => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + sessionTime
    }));
  };

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - stop counting time
        updateTimeSpent();
        isPageActive.current = false;
      } else {
        // Page visible - start counting time
        isPageActive.current = true;
        sessionStartTime.current = new Date();
      }
    };

    // Handle window focus/blur
    const handleFocus = () => {
      isPageActive.current = true;
      sessionStartTime.current = new Date();
    };

    const handleBlur = () => {
      updateTimeSpent();
      isPageActive.current = false;
    };

    // Initialize session start time
    sessionStartTime.current = progress.sessionStartTime || new Date();

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup
    return () => {
      updateTimeSpent();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [progress.sessionStartTime]);

  // Save progress to localStorage
  useEffect(() => {
    if (!examId) return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    
    allProgress[examId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  }, [progress, examId]);

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({
      ...prev,
      ...updates,
      examId: examId || prev.examId,
      lastSessionTime: new Date(),
      sessionStartTime: new Date()
    }));
    // Reset session start time for new activity
    sessionStartTime.current = new Date();
  };

  const saveAnswer = (questionNumber: number, selectedAnswers: string[], isCorrect: boolean) => {
    setProgress(prev => ({
      ...prev,
      examId: examId || prev.examId,
      answers: {
        ...prev.answers,
        [questionNumber]: {
          questionNumber,
          selectedAnswers,
          isCorrect,
          answeredAt: new Date()
        }
      },
      lastSessionTime: new Date(),
      sessionStartTime: new Date()
    }));
    // Reset session start time for new activity
    sessionStartTime.current = new Date();
  };

  const toggleTrainingMark = (questionNumber: number) => {
    setProgress(prev => ({
      ...prev,
      examId: examId || prev.examId,
      markedForTraining: prev.markedForTraining.includes(questionNumber)
        ? prev.markedForTraining.filter(q => q !== questionNumber)
        : [...prev.markedForTraining, questionNumber],
      lastSessionTime: new Date(),
      sessionStartTime: new Date()
    }));
    // Reset session start time for new activity
    sessionStartTime.current = new Date();
  };

  const resetProgress = () => {
    const newProgress: UserProgress = {
      examId: examId || '',
      answers: {},
      markedForTraining: [],
      currentQuestion: 1,
      isRandomized: false,
      startTime: new Date(),
      lastSessionTime: new Date(),
      totalTimeSpent: 0,
      sessionStartTime: new Date()
    };
    setProgress(newProgress);
  };

  const getAllProgress = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const clearAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({
      examId: examId || '',
      answers: {},
      markedForTraining: [],
      currentQuestion: 1,
      isRandomized: false,
      startTime: new Date(),
      lastSessionTime: new Date(),
      totalTimeSpent: 0,
      sessionStartTime: new Date()
    });
  };

  // Hàm để lấy tổng thời gian đã làm (bao gồm session hiện tại)
  const getCurrentTimeSpent = () => {
    if (!sessionStartTime.current || !isPageActive.current) {
      return progress.totalTimeSpent;
    }
    
    const now = new Date();
    const currentSessionTime = now.getTime() - sessionStartTime.current.getTime();
    return progress.totalTimeSpent + currentSessionTime;
  };

  return {
    progress,
    updateProgress,
    saveAnswer,
    toggleTrainingMark,
    resetProgress,
    getAllProgress,
    clearAllProgress,
    getCurrentTimeSpent
  };
};
